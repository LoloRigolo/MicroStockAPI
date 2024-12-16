import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3014", 10);

app.use(express.json());


app.listen(PORT, () => {
    console.log(`Service is running on http://localhost:${PORT}`);
  });