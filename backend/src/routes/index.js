import { Router } from 'express';

import investmentRouter from './investment-routes.js';


const router = Router();

router.use(investmentRouter);



export default router;
