import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({message: "Token manquant."});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({message: "Token invalide"});
    }
};

export function isAdmin(request, response, next) {
    if (request.user.role !== "admin") {
        return response.status(403).json({message: "Admin access needed!"});
    }
    next();
};