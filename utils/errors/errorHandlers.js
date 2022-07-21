import createError from 'http-errors';

export const sendError = async (req, res, next) => {
    next(new createError.NotFound());
};

export const errorHandler = (e, req, res, next) => {
    res.status(e.status || 500);
    res.send({
        error: {
            status: e.status || 500,
            message: e.message,
        },
    });
};
