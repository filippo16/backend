import { Request, Response } from "express";
import { getConnection } from '../config/db';

export async function createLog(req: Request, res: Response) {
    try {
        const { username, text, points, target, typeAction, active } = req.body;

        const query = 'INSERT INTO action_logs (username, text, points, target, typeAction, active) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [username, text, points, target, typeAction, active];

        const connection = await getConnection();
        await connection.execute(query, values);

        res.status(201).json({ success: true, message: 'Log salvato con successo' });
    } catch (error) {
        console.error('Errore durante la creazione della nota:', error);
        res.status(500).json({ success: false, message: 'Errore durante la creazione della nota' });
    }
}

export async function deleteLog(req: Request, res: Response) {
    try {
        const { idToDel, name } = req.body;

        const query = 'DELETE FROM action_logs WHERE id = ?';
        const values = [idToDel];

        const connection = await getConnection();
        await connection.execute(query, values);

        res.status(200).json({ success: true, message: 'Log eliminato con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione della nota:', error);
        res.status(500).json({ success: false, message: 'Errore durante l\'eliminazione della nota' });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const { name } = req.body;

        const query = 'SELECT * FROM users WHERE name = ?';
        const values = [name];

        const connection = await getConnection();
        const [rows]: any = await connection.execute(query, values);

        if(rows.length == 0) {
            throw new Error("Nessun utente presente!")
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (e: any) {
        res.status(200).json({ success: false, message: String(e) });
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const query = 'SELECT name, CAST(score AS SIGNED) as score, members FROM users';

        const connection = await getConnection();
        const [rows] = await connection.execute(query);

        const users = (rows as any[]).map((user: any) => ({
            name: user.name,
            score: parseInt(user.score, 10),
            members: user.members ? user.members.split('.') : []
        }));

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);
        res.status(500).json({ success: false, message: 'Errore nel recupero degli utenti' });
    }
}

export async function saveUser(req: Request, res: Response) {
    try {
        const { name } = req.body;

        const query = 'INSERT INTO users (name, score, role, members) VALUES (?, 0, "user", "")';
        const values = [name];

        const connection = await getConnection();
        await connection.execute(query, values);

        res.status(201).json({ success: true, message: 'Utente salvato!' });
    } catch (error) {
        console.error('Errore durante il salvataggio dell\'utente:', error);
        res.status(200).json({ success: false, message: 'Errore durante il salvataggio dell\'utente' });
    }
}

export async function saveSquad(req: Request, res: Response) {
    try {
        
        const { squad, name } = req.body;

        const squadString = squad.join('.');

        const query = 'UPDATE users SET members = ? WHERE name = ?';
        const values = [squadString, name];

        const connection = await getConnection();
        await connection.execute(query, values);

        res.status(200).json({ success: true, message: 'Squadra salvata con successo' });
    } catch (error) {
        console.error('Errore nel salvataggio della squadra:', error);
        res.status(500).json({ success: false, message: 'Errore nel salvataggio della squadra' });
    }
}