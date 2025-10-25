import Joi from "joi"

export const validateUser = (request, response, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(3).max(30).alphanum().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid("user", "admin").default("user"),
    });

    const {error} = schema.validate(request.body);
    if (error) {
        return response.status(400).json({message: error.details[0].message});
    }
    next();
};