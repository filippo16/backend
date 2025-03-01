"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
router.get('/sse', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const connectionId = `client-${Date.now()}`;
    console.log(`Nuovo client connesso: ${connectionId}`);
    let lastLogs = [];
    const formatLog = (log) => ({
        id: Number(log.id),
        username: String(log.username),
        text: String(log.text),
        points: Number(log.points),
        target: String(log.target),
        typeAction: String(log.typeAction),
        active: Boolean(log.active)
    });
    const sendUpdates = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield db_1.default.query('SELECT * FROM action_logs');
            const currentLogs = rows;
            const currentLogIds = currentLogs.map(log => log.id);
            const lastLogIds = lastLogs.map(log => log.id);
            // Log aggiunti
            const addedLogs = currentLogs.filter(log => !lastLogIds.includes(log.id));
            // Log eliminati
            const deletedLogIds = lastLogIds.filter(id => !currentLogIds.includes(id));
            // Invia i log aggiunti
            addedLogs.forEach(log => {
                res.write(`data: ${JSON.stringify({ type: 'update', log: formatLog(log) })}\n\n`);
            });
            // Invia i log eliminati
            deletedLogIds.forEach(id => {
                res.write(`data: ${JSON.stringify({ type: 'delete', log: { id } })}\n\n`);
            });
            res.flushHeaders();
            lastLogs = currentLogs;
        }
        catch (error) {
            console.error('Errore nella query:', error);
        }
    });
    const interval = setInterval(sendUpdates, 1000);
    req.on('close', () => {
        console.log(`Client disconnesso: ${connectionId}`);
        clearInterval(interval);
    });
}));
exports.default = router;
