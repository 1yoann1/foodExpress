import {User} from "../models/User.js";

export const userExists = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        req.userData = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    };
};