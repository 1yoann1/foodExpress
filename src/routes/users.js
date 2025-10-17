import express, { request } from "express";

import { User } from "../config/mongo.js";
import { userExists } from "../middleware/userExists.js";

const router = express.Router();

router.get("/", async (request, response) => {
  const users = await User.find();
  response.status(200).json(users);
});

router.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  response.status(200).json(user);
});

router.put("/:id", userExists, async (request, response) => {
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

router.delete("/:id", userExists, async(req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "user deleted successfully"});
  } catch (err) {
    console.error();
    res.status(500).json({err: "error deleting user"});
  }
});

export default router;