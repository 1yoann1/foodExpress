import express from "express";

import { User } from "../config/mongo.js";
import bcrypt from "bcrypt";
import { use } from "react";
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
    } catch (error) {
        response.status(500).json({error: "erreur lors de l'authentification de l'utilisateur"});
    };
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