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
const PORT = process.env.PORT || 443;

// Middleware
app.use(bodyParser.json());

// Routes
app.use(sseRoutes);
app.use(rot);



app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
