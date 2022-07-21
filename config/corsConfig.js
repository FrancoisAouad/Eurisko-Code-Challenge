// import allowedOrigins from './origin';

const corsConfig = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
};
export default corsConfig;

//---------Dynamically allocating origins---------//

// {
//     origin: (origin, callback) => {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     optionsSuccessStatus: 200,
//     credentials: true,
//     methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
//     // allowedHeaders: ['Content-Type', 'authorization'],
// };
