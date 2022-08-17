# Eurisko-REST-NoteApp-API

**List of updated changes is available inside the Project updates txt file**

The goal for this project is to create a basic REST API using nodeJS and the Express framework as the runtime environment, as well as having mongoDB as the main database. The API will also be able to perform basic CRUD operations on the notes, and Category. The user is also able to filter result by category, and search for notes with matching tags. 

The tools and libraries used to complete the project are the following:

1-**JWT**: Authentication

2-**Redis**: Database for caching

3-**ExpressJS**: Backend framework

4-**Bcrypt**: Encrypt sensitive user information

5-**Nodemailer**: Sending mail notifications

6-**Joi**: Input validation

7-**MongoDB**: Primary database

8-**Crypto**: Hash activation tokens

9-**CORS**: cross origin resource sharing

## Install & Setup

1-Download the project and open in VScode, or any of your preferred IDEs.

2-You must have [nodeJS](https://nodejs.org/en/download/) installed.

3-Use the following command in order to install the project dependencies, and devDependencies

```bash
npm install
```

4-The project also uses Redis as a secondary database. You must download the Redis source file either for [Linux](https://redis.io/download/) based systems, or for [Windows](https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504)

5-You can also use a GUI app for Redis. [Redis Commander](https://www.npmjs.com/package/redis-commander), or [AnotherRedisDesktopManager](https://github.com/qishibo/AnotherRedisDesktopManager)

6-Open a second command terminal and copy the following command to start the redis server

```bash
redis-server
```

## Scripts

**Generate Token**

This script allows us to generate secrets for the JWT tokens for Access, refresh, and resetPassword Tokens

```bash
npm run gen-tokens
```
**Start Build**

The script allows to start and automatically restart the server using nodemon

```bash
npm start
```

## Table of Contents

- [Config](https://github.com/FrancoisAouad/Eurisko-Code-Challenge-FrancoisAouad/tree/eurisko/config)

- [Controllers](https://github.com/FrancoisAouad/Eurisko-Code-Challenge-FrancoisAouad/tree/eurisko/controllers)

- [Middleware](https://github.com/FrancoisAouad/Eurisko-Code-Challenge-FrancoisAouad/tree/eurisko/middleware)

- [Models](https://github.com/FrancoisAouad/Eurisko-Code-Challenge-FrancoisAouad/tree/eurisko/models)

- [Routes](https://github.com/FrancoisAouad/Eurisko-Code-Challenge-FrancoisAouad/tree/eurisko/routes)

- [Uploads](https://github.com/FrancoisAouad/Eurisko-Code-Challenge-FrancoisAouad/tree/eurisko/uploads)

- [Utils](https://github.com/FrancoisAouad/Eurisko-Code-Challenge-FrancoisAouad/tree/eurisko/utils)
