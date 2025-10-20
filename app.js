"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_typescript_1 = require("sequelize-typescript");
const user_js_1 = require("./src/models/user.js"); // make sure .js if using compiled version
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Initialize Sequelize connection
const sequelize = new sequelize_typescript_1.Sequelize(process.env.DB_URL, {
    dialect: "postgres",
    models: [user_js_1.User], // All your models go here
    logging: console.log,
});
sequelize
    .authenticate()
    .then(() => console.log(" Connection established successfully"))
    .catch((err) => console.error("Unable to connect to the database:", err));
sequelize
    .sync({ alter: true })
    .then(() => console.log("All models synchronized"))
    .catch((err) => console.error("Model sync failed:", err));
app.get("/", (req, res) => {
    res.send("Server is running...");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
