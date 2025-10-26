/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentification des utilisateurs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d’un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation ou email déjà utilisé
 *
 * /auth/login:
 *   post:
 *     summary: Connexion d’un utilisateur existant
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie un token JWT
 *       401:
 *         description: Identifiants invalides
 *
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nom d'utilisateur
 *         email:
 *           type: string
 *           description: Adresse email
 *         password:
 *           type: string
 *           description: Mot de passe
 *       example:
 *         username: Yoann
 *         email: yoann@example.com
 *         password: azerty123
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Adresse email
 *         password:
 *           type: string
 *           description: Mot de passe
 *       example:
 *         email: yoann@example.com
 *         password: azerty123
 */

import express from "express";

import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

router.post('/register', validateUser, async (request, response) => {
    try {
        const emailVerif = await User.findOne({email : request.body.email});
        if (emailVerif) {
            return response.status(401).json({error: "email déja utilisé"});
        }
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const newUser = new User ({...request.body, password: hashedPassword});
        const saveUser = await newUser.save();
        response.status(200).json({ 
            message: `Bienvenue ${saveUser.username}, ton compte a été créé avec succès. Tu peux te connecter !`, 
            id: saveUser._id 
        });
    } catch (err) {
        console.error("Erreur register:", err.message);
        response.status(500).json({ error: err.message });
    }
});

router.post('/login', async (request, response) => {
    try {
        const {email, password} = request.body;
        if (!email || !password) {
            return response.status(401).json({ error: "Email ou mot de passe requis."});
        };
        const user = await User.findOne({email});
        if (!user) {
            return response.status(401).json({error: "Utilisateur inexistant."});
        };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).json({error : "Mot de passe incorrect."});
        };
        const token = generateToken(user);
        response.status(200).json({
            message : `Bienvenue ${user.username} ! Connexion Réussie.`,
            id : user._id,
            role : user.role
        });
    } catch (error) {
        console.error("Error :", error);
        response.status(500).json({ error: "Erreur lors de la recherche de l'utilisateur." });
    };
});

export default router;