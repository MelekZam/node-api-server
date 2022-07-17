import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    BaseEntity,
} from "typeorm";

@Unique(["courriel"])
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    courriel: string;

    @Column()
    password: string;
}
