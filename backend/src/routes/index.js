import { Router } from 'express';

import investmentRouter from './investment-routes.js';
import companyRouter from './company-routes.js';
import compareRouter from './compare-routes.js';
import favoriteRouter from './favorite-routes.js';



const router = Router();

router.use(investmentRouter);
router.use(favoriteRouter);
router.use(companyRouter);
router.use(compareRouter);



export default router;
