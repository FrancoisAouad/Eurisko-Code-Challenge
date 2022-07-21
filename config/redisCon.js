import redis from 'redis';

const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
});

client.on('connect', () => {
    console.log('Client connected to Redis.'.red.bold);
});

client.on('ready', () => {
    console.log('Client connected to Redis and Ready to use.'.red.italic.bold);
});

client.on('error', (err) => {
    console.log(err.message);
});

client.on('end', () => {
    console.log('Client disconnected from redis'.red.italic.bold);
});

process.on('SIGINT', () => {
    client.quit();
});

export default client;
