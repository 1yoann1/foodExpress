/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Récupère la liste des restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de résultats par page
 *     responses:
 *       200:
 *         description: Liste paginée des restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *         - opening_hours
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré du restaurant
 *         name:
 *           type: string
 *           description: Nom du restaurant
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         opening_hours:
 *           type: string
 *       example:
 *         name: "Espace Aurore"
 *         address: "23 Rue au Curé"
 *         phone: "01539451100"
 *         opening_hours: "9h-22h"
 */

import express, { request } from "express";

import { Restaurant } from "../models/Restaurant.js";
import { userExists } from "../middleware/userExists.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";
import { validateRestaurant } from "../middleware/validateRestaurant.js";

const router = express.Router();

router.get("/", async (request, response) => {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Restaurant.countDocuments();
    const restaurants = await Restaurant.find()
        .skip(skip)
        .limit(limit);
    
    response.status(200).json({
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: restaurants,
    });
});

router.get("/:id", async (request, response) => {
  try {
    const restaurant = await Restaurant.findById(request.params.id);
    if (!restaurant) {
      return response.status(404).json({message : "Restaurant not found"});
    }
    response.status(200).json(restaurant);
  } catch (err) {
    response.status(500).json({message: "Erreur serveur"});
  }
});

router.post("/:id", verifyToken, isAdmin, validateRestaurant, async (request, response) => {
  try {
    const {name, address, phone, opening_hours} = request.body;
    const newRestaurant = new Restaurant({
      name,
      address,
      phone,
      opening_hours,
    });
    await newRestaurant.save();
    response.status(200).json({message: "Restaurant created", restaurant: newRestaurant});
  } catch (err) {
    response.status(500).json({message: "Creation error"});
  }
});

router.put("/:id", verifyToken, isAdmin, validateRestaurant, async (request, response) => {
  try {
    const updateRestaurant = await Restaurant.findByIdAndUpdate(
      request.params.id,
      request.body,
      {new: true}
    );
    if (!updateRestaurant) {
      return response.status(404).json({message: "Restaurant not found"});
    }
    response.status(200).json({message: "Restaurant updated", restaurant: updateRestaurant});
  } catch (err) {
    response.status(500).json({message: "Update Error"});
  }
});

router.delete("/:id", verifyToken, isAdmin, async(request, response) => {
  try {
    const deleteRestaurant = await Restaurant.findByIdAndDelete(request.params.id);
    if (!deleteRestaurant) {
      return response.status(404).json({message: "Restaurant not found"});
    }
    response.status(200).json({message: "Restaurant deleted"});
  } catch (err) {
    response.status(500).json({message: "Supression error"});
  }
});

export default router;