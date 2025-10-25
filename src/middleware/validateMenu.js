import Joi from "joi";

export const validateMenu = (req, res, next) => {
  const schema = Joi.object({
    restaurant_id: Joi.string().required(),
    name: Joi.string().min(2).required(),
    description: Joi.string().min(5).required(),
    price: Joi.number().positive().required(),
    category: Joi.string().min(3).required(),
  });

  const {error} = schema.validate(req.body);
  if (error) return res.status(400).json({message: error.details[0].message});
  next();
};
