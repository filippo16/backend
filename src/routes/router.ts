import { Router } from "express";

import * as act from "../controller/controller";

const router = Router();

router.post("/save_log", act.createLog);
router.post("/delete_log", act.deleteLog);
router.post("/get_user", act.getUser);
router.get("/get_users", act.getUsers);
router.post("/save_user", act.saveUser);
router.post("/save_squad", act.saveSquad);

export default router;