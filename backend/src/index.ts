import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recipesRouter from "./router/recipes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/recipes", recipesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
