import mongoose from "mongoose"

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: {type: String, required: true},
    phone: {type: String, required: true},
    opening_hours: {type: String, required: true},
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);