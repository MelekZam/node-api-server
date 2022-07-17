import express from "express";
import { Answer } from "./entity/Answer";
import { Question } from "./entity/Question";
import { User } from "./entity/User";
import bcrypt from "bcrypt";
import auth from "./authMiddleware";
import jwt from "jsonwebtoken";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/questions", auth, async (req, res) => {
    const allQuestions = await Question.find();
    res.send(allQuestions);
});

router.post("/question", auth, async (req: any, res) => {
    const questionExists = await Question.findOneBy({
        courriel: req.body.courriel,
    });
    if (req.body.courriel !== req.user.courriel)
        return res
            .status(403)
            .send("Le courriel fourni ne correspond pas à votre compte.");
    if (questionExists)
        return res
            .status(409)
            .send(
                "Question deja exists avec ce même courriel, veuillez supprimer cette question d'abord"
            );
    try {
        await Question.save(req.body);
    } catch (error) {
        return res.status(500).send("erreur dans le server");
    }
    res.status(201).send("succés");
});

router.put("/question/:id", auth, async (req: any, res) => {
    const question = await Question.findOne({
        where: { id: Number(req.params.id) },
        relations: ["answer"],
    });
    if (req.body.courriel !== req.user.courriel)
        return res
            .status(403)
            .send("Le courriel fourni ne correspond pas à votre compte.");
    if (!question) return res.status(404).send("Question n'existe pas");
    if (question.courriel == req.body.courriel)
        return res
            .status(403)
            .send("Vous ne pouvez pas répondre à votre question.");
    question.answer.forEach((el) => {
        if (el?.courriel == req.body.courriel)
            return res
                .status(409)
                .send("Vous avez déja répondu à cette question");
    });
    const answer = new Answer();
    answer.reponse = req.body.reponse;
    answer.courriel = req.body.courriel;
    answer.question = question;
    await answer.save();
    res.status(201).send("succés.");
});

router.get("/question/:id", auth, async (req: any, res) => {
    const { courriel } = req.user;
    const question = await Question.findOne({
        where: { id: req.params.id },
        relations: ["answer"],
    });
    if (!question) return res.status(404).send("Question n'existe pas");
    if (question.courriel != courriel)
        return res
            .status(403)
            .send("La question n'est pas la vôtre pour voir les reponses.");
    return res.status(200).send(question.answer);
});

router.delete("/question/:id", auth, async (req: any, res) => {
    const { courriel } = req.user;
    const question = await Question.findOneBy({
        id: req.params.id,
    });
    if (!question) return res.status(404).send("Cette question n'existe pas");
    if (question.courriel !== courriel)
        return res
            .status(403)
            .send("Cette question n'est pas le vôtre pour supprimer.");
    await Question.delete(req.params.id);
    return res.status(200).send("succés.");
});

router.post("/signup", async (req, res) => {
    const { courriel, password } = req.body;
    const user = new User();
    user.courriel = courriel;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.save();
    res.status(200).send("succés, vous pouvez connecter à votre compte.");
});

router.post("/login", async (req, res) => {
    const { courriel, password } = req.body;
    const user = await User.findOneBy({
        courriel,
    });
    if (!user) return res.status(404).send("Email/mot de pass incorrectes");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res.status(404).send("Email/mot de pass incorrectes");
    const token = generateAccessToken({ id: user.id, courriel: user.courriel });
    res.status(200).json({ token });
});

const generateAccessToken = (user) => {
    return jwt.sign(user, "this_is_an_example");
};

export default router;
