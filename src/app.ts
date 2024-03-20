import express, { json } from "express";
import "reflect-metadata";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { musicianRouter } from "./routes/musicians.route.js";
import { authRouter } from "./routes/auth.route.js";
import { verifyToken } from "./middlewares/verify-token.middleware.js";

const app = express();

app.use(json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next); //em = Entity Manager: abstraccion que permite manejar todas las entidades que definimos y nos permite manejarlas uniformemente (unit of work)
});

app.use("/auth", authRouter);
app.use("/musician", verifyToken, musicianRouter);

await syncSchema(); // Never in prod

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
