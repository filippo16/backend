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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLog = createLog;
exports.deleteLog = deleteLog;
exports.getUser = getUser;
exports.getUsers = getUsers;
exports.saveUser = saveUser;
exports.saveSquad = saveSquad;
const db_1 = require("../config/db");
function createLog(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, text, points, target, typeAction, active } = req.body;
            const query = 'INSERT INTO action_logs (username, text, points, target, typeAction, active) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [username, text, points, target, typeAction, active];
            const connection = yield (0, db_1.getConnection)();
            yield connection.execute(query, values);
            res.status(201).json({ success: true, message: 'Log salvato con successo' });
        }
        catch (error) {
            console.error('Errore durante la creazione della nota:', error);
            res.status(500).json({ success: false, message: 'Errore durante la creazione della nota' });
        }
    });
}
function deleteLog(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { idToDel, name } = req.body;
            const query = 'DELETE FROM action_logs WHERE id = ?';
            const values = [idToDel];
            const connection = yield (0, db_1.getConnection)();
            yield connection.execute(query, values);
            res.status(200).json({ success: true, message: 'Log eliminato con successo' });
        }
        catch (error) {
            console.error('Errore durante l\'eliminazione della nota:', error);
            res.status(500).json({ success: false, message: 'Errore durante l\'eliminazione della nota' });
        }
    });
}
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const query = 'SELECT * FROM users WHERE name = ?';
            const values = [name];
            const connection = yield (0, db_1.getConnection)();
            const [rows] = yield connection.execute(query, values);
            if (rows.length == 0) {
                throw new Error("Nessun utente presente!");
            }
            res.status(200).json({ success: true, data: rows[0] });
        }
        catch (e) {
            res.status(200).json({ success: false, message: String(e) });
        }
    });
}
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = 'SELECT name, CAST(score AS SIGNED) as score, members FROM users';
            const connection = yield (0, db_1.getConnection)();
            const [rows] = yield connection.execute(query);
            const users = rows.map((user) => ({
                name: user.name,
                score: parseInt(user.score, 10),
                members: user.members ? user.members.split('.') : []
            }));
            res.status(200).json({ success: true, data: users });
        }
        catch (error) {
            console.error('Errore nel recupero degli utenti:', error);
            res.status(500).json({ success: false, message: 'Errore nel recupero degli utenti' });
        }
    });
}
function saveUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name } = req.body;
            const query = 'INSERT INTO users (name, score, role, members) VALUES (?, 0, "user", "")';
            const values = [name];
            const connection = yield (0, db_1.getConnection)();
            yield connection.execute(query, values);
            res.status(201).json({ success: true, message: 'Utente salvato!' });
        }
        catch (error) {
            console.error('Errore durante il salvataggio dell\'utente:', error);
            res.status(200).json({ success: false, message: 'Errore durante il salvataggio dell\'utente' });
        }
    });
}
function saveSquad(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { squad, name } = req.body;
            const squadString = squad.join('.');
            const query = 'UPDATE users SET members = ? WHERE name = ?';
            const values = [squadString, name];
            const connection = yield (0, db_1.getConnection)();
            yield connection.execute(query, values);
            res.status(200).json({ success: true, message: 'Squadra salvata con successo' });
        }
        catch (error) {
            console.error('Errore nel salvataggio della squadra:', error);
            res.status(500).json({ success: false, message: 'Errore nel salvataggio della squadra' });
        }
    });
}
