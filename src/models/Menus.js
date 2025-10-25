import mongoose from "mongoose"
import { Restaurant } from "./Restaurant"

const menuSchema = new mongoose.Schema({
    restaurant_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
    },
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    category: {type: String, required: true},
})

export const Menu = mongoose.model("Menu", menuSchema);