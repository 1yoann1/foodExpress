import express, { request } from "express";

import { User } from "../models/User.js";
import { userExists } from "../middleware/userExists.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validateUser } from "../middleware/validateUser.js";

const router = express.Router();

router.get("/", verifyToken, verifyRole(["admin"]), async (request, response) => {
  const users = await User.find();
  response.status(200).json(users);
});

router.get("/:id", verifyToken, async (request, response) => {
  if (request.user.role !== "admin" && request.user.id !== request.params.id) {
    return response.status(403).json({message: "Access denied"});
  }
  const user = await User.findById(request.params.id);
  response.status(200).json(user);
});

router.put("/:id", verifyToken, userExists, validateUser, async (request, response) => {
  if (request.user.role !== "admin" && request.user.id !== request.params.id) {
    return response.status(403).json({message: "Access denied"});
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );
    res.status(200).json({message: "user updated succesfully", user: updateUser});
  } catch (err) {
    res.status(500).json({message: "Error updating the user", error: err});
  } 
});

router.delete("/:id", verifyToken, userExists, async(req, res) => {
  if (request.user.role !== "admin" && request.user.id !== request.params.id) {
    return response.status(403).json({message: "Access denied"});
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "user deleted successfully"});
  } catch (err) {
    console.error();
    res.status(500).json({err: "error deleting user"});
  }
});

export default router;