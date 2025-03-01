import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import https from 'https';
import fs from 'fs';
import path from 'path';

import sseRoutes from './routes/sse';
import rot from './routes/router';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(sseRoutes);
app.use(rot);

// app.use(express.static("dist-frontend"));

// const sslOptions = {
//     key: fs.readFileSync(path.join(__dirname, 'miocert.key')),
//     cert: fs.readFileSync(path.join(__dirname, 'miocert.crt'))
// };
//   // /etc/ssl/private/miocert.key
// ///etc/ssl/certs/miocert.crt
// // Avvio del server HTTPS
// https.createServer(sslOptions, app).listen(PORT, () => {
// console.log(`Server in ascolto su https://localhost:${PORT}`);
// });

app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
