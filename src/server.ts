import "reflect-metadata";
import { myDataSource } from "./db.js";
import express from "express";
import router from "./routes.js";

const app = express();
const port = 5000;

myDataSource
    .initialize()
    .then(async () => {
        console.log("DataBase has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

app.use(router);

app.listen(port, () => {
    console.log(`App is now listening on port ${port}`);
});
