import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import corsConfig from './config/corsConfig.js';
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import adminRoutes from './routes/admin.js';
import categoryRoutes from './routes/category.js';
import './config/mongoCon.js';
import './config/redisCon.js';
import * as dotenv from 'dotenv';
import { errorHandler, sendError } from './utils/errors/errorHandlers.js';
import fileUpload from 'express-fileupload';
dotenv.config();
import 'colors';

//INITIALIZATION
const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(cors(corsConfig));
const __dirname = path.resolve();

app.use(express.json());
app.use(
    fileUpload({
        createParentPath: true,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', noteRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1/admin', adminRoutes);

//ERROR HANDLERS
app.use(sendError);
app.use(errorHandler);

//SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`.cyan.bold);
});
