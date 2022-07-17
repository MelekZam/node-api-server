import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    Unique,
    OneToMany,
} from "typeorm";
import { Answer } from "./Answer";

@Unique(["courriel"])
@Entity()
export class Question extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ select: false })
    nom: string;

    @Column({ select: false })
    prenom: string;

    @Column()
    question: string;

    @Column()
    courriel: string;

    @OneToMany(() => Answer, (answer) => answer.question)
    answer: Answer[];
}
