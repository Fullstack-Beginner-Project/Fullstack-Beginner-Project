import { Router } from 'express';

import investmentRouter from './investment-routes.js';
import companyRouter from './company-routes.js';


const router = Router();

router.use(investmentRouter);
router.use(companyRouter);


export default router;
