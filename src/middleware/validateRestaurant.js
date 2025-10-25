import Joi from "joi";

export const validateRestaurant = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).required(),
    address: Joi.string().min(5).required(),
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .min(8)
      .required(),
    opening_hours: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};
