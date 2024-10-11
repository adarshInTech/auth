import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connect from './src/db/connect.js';
import cookieParser from 'cookie-parser';
import fs from 'fs';
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes

const routeFiles = fs.readdirSync('./src/routes');

routeFiles.forEach((file) => {
  // use dynamic import
  import(`./src/routes/${file}`)
    .then((route) => {
      app.use('/api/v1', route.default);
    })
    .catch((err) => {
      console.log('error in server  ');
    });
});

const server = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (error) {
    console.log(' failed to start server .....', error.message);
    process.exit(1);
  }
};

server();
