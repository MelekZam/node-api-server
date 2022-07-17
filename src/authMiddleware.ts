import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401).send("Vous n'êtes pas autorisés");
    jwt.verify(token, "this_is_an_example", (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(401).send("Vous n'êtes pas autorisés");
        req.user = user;
        next();
    });
}

export default authenticateToken;
