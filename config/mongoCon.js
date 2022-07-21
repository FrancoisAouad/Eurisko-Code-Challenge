import mongoose from 'mongoose';

mongoose
    .connect(
        'mongodb://francois:frank123@test-shard-00-00.i0yxd.mongodb.net:27017,test-shard-00-01.i0yxd.mongodb.net:27017,test-shard-00-02.i0yxd.mongodb.net:27017/?ssl=true&replicaSet=atlas-f6mr88-shard-0&authSource=admin&retryWrites=true&w=majority',
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
