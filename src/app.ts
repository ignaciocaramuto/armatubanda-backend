import express, { json } from "express";
import "reflect-metadata";
import { orm, syncSchema } from "./shared/db/orm.js";
import { RequestContext } from "@mikro-orm/core";
import { musicianRouter } from "./routes/musicians.route.js";
import { authRouter } from "./routes/auth.route.js";
import { verifyToken } from "./middlewares/verify-token.middleware.js";
import { instrumentRouter } from "./routes/instruments.route.js";
import { genreRouter } from "./routes/genres.route.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { validation } from "./middlewares/validation.middleware.js";
import { registerLoginSchema } from "./validations/register-login.validation.js";
import { postRouter } from "./routes/posts.route.js";
import { commentRouter } from "./routes/comments.route.js";
import { bandRouter } from "./routes/bands.route.js";
import { advertisementRouter } from "./routes/advertisement.route.js";
import { applicationRouter } from "./routes/applications.route.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import { invitationRouter } from "./routes/invitations.route.js";
import { adminValidation } from "./middlewares/admin.middleware.js";

const app = express();

app.use(json());
app.use(corsMiddleware());
app.use((req, res, next) => {
  RequestContext.create(orm.em, next); //em = Entity Manager: abstraccion que permite manejar todas las entidades que definimos y nos permite manejarlas uniformemente (unit of work)
});

app.use("/auth", authRouter);
app.use("/musician", verifyToken, musicianRouter);
app.use("/band", verifyToken, bandRouter);
app.use("/instrument", verifyToken, instrumentRouter);
app.use("/genre", verifyToken, genreRouter);
app.use("/post", verifyToken, postRouter);
app.use("/comment", verifyToken, commentRouter);
app.use("/images", express.static("images"));
app.use("/advertisement", verifyToken, advertisementRouter);
app.use("/application", verifyToken, applicationRouter);
app.use("/invitation", verifyToken, invitationRouter);

await syncSchema(); // Never in prod

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
