const Joi = require('joi');

const signupVailidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
        console.log('Validation error:', error.details); // Log the error details
        return res.status(400).json({ message: "Bad request", error: error.details });
    }
    next();
};

const loginVailidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(100).required(),
    });
    const {error, value} = schema.validate(req.body);
    if(error) {
        return res.status(400)
            .json({message: "Bad request", error});
    }
    next();
}

module.exports = {
    signupVailidation,
    loginVailidation,
};