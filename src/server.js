import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import restaurantRouter from "./routes/restaurants.js"
import menusRouter from "./routes/menus.js"
import usersRouter from "./routes/users.js";
import registerRouter from "./routers/register.js"

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/users", usersRouter);
app.use("/auth", registerRouter);
app.use("/restaurant", restaurantRouter);
app.use("/menus", menusRouter);

export default app;