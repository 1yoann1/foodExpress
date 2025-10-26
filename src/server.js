import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import restaurantRouter from "./routes/restaurants.js"
import menusRouter from "./routes/menus.js"
import usersRouter from "./routes/users.js";
import registerRouter from "./routes/register.js"
import connectDB from "./config/mongo.js";
import { swaggerUi, swaggerSpec } from "../swagger.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", usersRouter);
app.use("/auth", registerRouter);
app.use("/restaurants", restaurantRouter);
app.use("/menus", menusRouter);

export default app;