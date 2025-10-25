import Joi from "joi"

export const validateUser = (request, response, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required,
        username: Joi.string().username().min(3).required,
        password: Joi.string().password().min(8)/required,
        role: Joi.string().valid("user", "admin"),
    });

    const {error} = schema.validate(request.body);
    if (error) {
        return response.status(400).json({message: error.details[0].message});
    }
}