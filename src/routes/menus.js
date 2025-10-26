/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - restaurantId
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré du menu
 *         name:
 *           type: string
 *           description: Nom du plat
 *         price:
 *           type: number
 *           description: Prix du plat
 *         restaurantId:
 *           type: string
 *           description: Référence au restaurant associé
 */

/**
 * @swagger
 * /menus:
 *   get:
 *     summary: Récupère la liste de tous les menus
 *     tags: [Menus]
 *     responses:
 *       200:
 *         description: Liste de tous les menus
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 */

import express, { request } from "express";

import { Menu } from "../models/Menus.js";
import { userExists } from "../middleware/userExists.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { validateMenu } from "../middleware/validateMenu.js";

const router = express.Router();

router.get("/", async (request, response) => {
  try {
    const {sort, limit = 10, page = 1} = request.query;
    let sortOption = {};
    if (sort === "price") sortOption.price = 1;
    else if (sort === "category") sortOption.category = 1;

    const skip = (page - 1) * limit;
    const menus = await Menu.find()
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate("restaurant_id", "name");
    response.json(menus);
  } catch (err) {
    response.status(500).json({message: "error"});
  }
});

router.get("/:id", async (request, response) => {
   try {
    const menu = await Menu.findById(request.params.id).populate("restaurant_id", "name");
    if (!menu) {
      return response.status(404).json({message: "Menu not found"});
    }
    response.json(menu);
   } catch (err) {
    console.error("Erreur menus:", err.message);
    response.status(500).json({ message: err.message });
  }
});

router.post("/", verifyToken, isAdmin, validateMenu, async (request, response) => {
  try {
    const menu = new Menu(request.body);
    await menu.save();
    response.status(201).json(menu);
  } catch (err) {
    console.error("Erreur menus:", err.message);
    response.status(500).json({ message: err.message });
  }
});

router.put("/:id", verifyToken, isAdmin, validateMenu, async (request, response) => {
  try {
    const updated = await Menu.findByIdAndUpdate(request.params.id, request.body, {new: true});
    if (!updated) {
      return response.status(404).json({message: "Menu not found"});
    }
    response.json(updated);
  } catch (err) {
    response.status(400).json({message: err.message});
  }
});

router.delete("/:id", verifyToken, isAdmin, async(request, response) => {
  try {
    const deleted = await Menu.findByIdAndDelete(request.params.id);
    if (!deleted) {
      return response.status(404).json({message: "Menu not found"});
    }
    response.json({message: "Menu deleted successfully"});
  } catch (err) {
    response.status(500).json({message: err.message});
  }
});

export default router;