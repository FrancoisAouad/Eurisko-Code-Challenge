import mongoose from 'mongoose';
//mongodb+srv://francois:frank123@test.i0yxd.mongodb.net/?retryWrites=true&w=majority
mongoose
    .connect(
        'mongodb+srv://francois:frank123@test.i0yxd.mongodb.net/?retryWrites=true&w=majority',
        {
            dbName: process.env.DB_NAME,
        }
    )
    .then(() => {
        console.log('Connected to MongoDB'.green.bold);
    })
    .catch((err) => console.log(err.message));

mongoose.connection.on('connected', () => {
    console.log('Mongoose connection is UP.'.green.italic.bold);
});

mongoose.connection.on('error', (err) => {
    console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is DOWN.'.green.italic.bold);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});
