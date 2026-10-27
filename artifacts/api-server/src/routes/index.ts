import { Router, type IRouter } from "express";
import cyberDuelRouter from "./cyber-duel";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cyberDuelRouter);

export default router;
