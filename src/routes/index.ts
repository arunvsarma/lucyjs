import { Router } from 'express';
import { Request, Response } from 'express';

import PageAnalyzer from '../controllers/PageAnalyzer';

const router = Router();

export const lucyJs = (req: Request, res: Response) => {
    res.send('Lucy says - Hello!');
}

router.get('/lucyjs', lucyJs);
router.get('/lucyjs/test', PageAnalyzer.runTest);

export default router;