import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { UserFactory } from "./models/user"; 
import { SchemeFactory } from "./models/schemes";
import { FeedbackFactory } from "./models/feedback";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize(process.env.DB_URL!, {
  dialect: "postgres",
  logging: false,
});

UserFactory(sequelize);
SchemeFactory(sequelize);
FeedbackFactory(sequelize);

sequelize
  .authenticate()
  .then(() => console.log("Connection established successfully"))
  .catch((err: any) => console.error("Unable to connect to the database:", err));

sequelize
  .sync({ alter: true })
  .then(() => console.log("All models synchronized"))
  .catch((err: any) => console.error("Model sync failed:", err));

import userRoutes from "./api/routes/user.routes";
import authRoutes from "./api/routes/auth.routes";
import schemeRoutes from "./api/routes/scheme.route"


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes);
app.use("/api/schemes", schemeRoutes)

app.get("/", (req, res) => {
  res.send("Server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
