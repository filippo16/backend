"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const sse_1 = __importDefault(require("./routes/sse"));
const router_1 = __importDefault(require("./routes/router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 443;
// Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Routes
app.use(sse_1.default);
app.use(router_1.default);
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
