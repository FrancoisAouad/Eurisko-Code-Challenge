import Joi from '@hapi/joi';

//CATEGORY VALIDATION
export const categorySchema = Joi.object({
    categoryName: Joi.string()
        .required()
        .error((errors) => {
            errors.forEach((err) => {
                switch (err.type) {
                    case 'string.empty':
                        err.message = 'Enter Category Name';
                        break;
                    case 'any.required':
                        err.message = `Category is required`;
                        break;
                    default:
                        break;
                }
            });
            return errors;
        }),
});
