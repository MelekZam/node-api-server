import { DataSource } from "typeorm";
import { Answer } from "./entity/Answer";
import { Question } from "./entity/Question";
import { User } from "./entity/User";

export const myDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "db",
    entities: [Question, Answer, User],
    logging: true,
    synchronize: true,
});
