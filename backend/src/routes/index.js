import { Router } from 'express';

import investmentRouter from './investment-routes.js';
import companyRouter from './company-routes.js';
import compareRouter from './compare-routes.js';
import compareStatusRouter from './compare-status-routes.js';



const router = Router();

router.use(investmentRouter);
router.use(companyRouter);
router.use(compareRouter);
router.use(compareStatusRouter);



export default router;
