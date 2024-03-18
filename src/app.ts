import express, { json } from "express";
import { musicianRouter } from "./routes/musicians.js";

const app = express();

app.use(json());

app.use("/musician", musicianRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});
