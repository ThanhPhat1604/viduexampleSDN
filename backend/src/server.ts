import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recipesRouter from "./router/recipes"; 

dotenv.config();

const app = express();

// Cấu hình CORS cho frontend Next.js
app.use(cors({
  origin: "http://localhost:3000",
}));

app.use(express.json());

// Route test
app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

// Gắn router cho /recipes
app.use("/recipes", recipesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
