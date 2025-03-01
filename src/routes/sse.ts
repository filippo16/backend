import express, { Request, Response } from 'express';
import pool from '../config/db';

const router = express.Router();

router.get('/sse', async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const connectionId = `client-${Date.now()}`;
    console.log(`Nuovo client connesso: ${connectionId}`);

    let lastLogs: any[] = [];

    const formatLog = (log: any) => ({
        id: Number(log.id),
        username: String(log.username),
        text: String(log.text),
        points: Number(log.points),
        target: String(log.target),
        typeAction: String(log.typeAction),
        active: Boolean(log.active)
    });

    const sendUpdates = async () => {
        try {
            const [rows] = await pool.query('SELECT * FROM action_logs');
            const currentLogs: any[] = rows as any[];

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
        } catch (error) {
            console.error('Errore nella query:', error);
        }
    };

    const interval = setInterval(sendUpdates, 1000);

    req.on('close', () => {
        console.log(`Client disconnesso: ${connectionId}`);
        clearInterval(interval);
    });
});

export default router;
