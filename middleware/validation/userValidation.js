import Joi from '@hapi/joi';

//LOGIN VALIDATION
export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'string.empty':
                        err.message = 'Enter Email';
                        break;
                    case 'string.email':
                        err.message = `Enter valid email address`;
                        break;
                    case 'any.required':
                        err.message = `Enter Password`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
    password: Joi.string()
        .min(2)
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'string.min':
                        err.message = `Password should have atleast 6characters!`;
                        break;
                    case 'string.max':
                        err.message = `Password should be at most 32 characters!`;
                        break;
                    case 'any.required':
                        err.message = `Enter Password`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
});
//REGISTER VALIDATION
export const signupSchema = Joi.object({
    name: Joi.string()
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'string.empty':
                        err.message = 'Enter name';
                        break;
                    case 'any.required':
                        err.message = `Enter name`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),

    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'string.empty':
                        err.message = 'Enter Email';
                        break;
                    case 'string.email':
                        err.message = `Enter valid email address`;
                        break;
                    case 'any.required':
                        err.message = `Enter Password`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
    password: Joi.string()
        .min(6)
        .max(32)
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'string.min':
                        err.message = `Password should have atleast 6characters!`;
                        break;
                    case 'string.max':
                        err.message = `Password should be at most 32 characters!`;
                        break;
                    case 'any.required':
                        err.message = `Enter Password`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
    confirmPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'any.empty':
                        err.message = 'Re-enter Password';
                        break;
                    case 'any.required':
                        err.message = `Enter Password`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
});
//NEW PASSWORD VALIDATION
export const resetPassSchema = Joi.object({
    password: Joi.string()
        .min(6)
        .max(32)
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'string.min':
                        err.message = `Password should have atleast 6characters!`;
                        break;
                    case 'string.max':
                        err.message = `Password should be at most 32 characters!`;
                        break;
                    case 'any.required':
                        err.message = `Enter Password`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
    confirmPassword: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'any.empty':
                        err.message = 'Re-enter Password';
                        break;
                    case 'any.required':
                        err.message = `Enter Password`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
});
