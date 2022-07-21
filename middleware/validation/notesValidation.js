import Joi from '@hapi/joi';

//NOTE VALIDATION
export const noteSchema = Joi.object({
    title: Joi.string()
        .required()
        .min(1)
        .max(16)
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'string.empty':
                        err.message = 'Invalid Title';
                        break;
                    case 'any.required':
                        err.message = `Title is required`;
                        break;
                    case 'string.min':
                        err.message = `Title must be at least 1 character`;
                        break;
                    case 'string.max':
                        err.message = `Title must be at most 16 character`;
                        break;
                    default:
                        break;
                }
            });

            return errors;
        }),
    content: Joi.required().error((errors) => {
        errors.forEach((err) => {
            switch (err.type) {
                case 'any.required':
                    err.message = `Content is empty.`;
                    break;
                default:
                    break;
            }
        });

        return errors;
    }),
    tags: Joi.any().error((errors) => {
        errors.forEach((err) => {
            console.log(err);
        });

        return errors;
    }),
    category: Joi.string().error((errors) => {
        errors.forEach((err) => {
            switch (err.type) {
                case 'string.empty':
                    err.message = 'Invalid Category';
                    break;
            }
        });

        return errors;
    }),
});
