import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import { Question } from "./Question";

@Entity()
export class Answer extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    reponse: string;

    @Column()
    courriel: string;

    @ManyToOne(() => Question, (question) => question.answer, {
        cascade: true,
        onDelete: "CASCADE",
    })
    @JoinColumn()
    question: Question;
}
