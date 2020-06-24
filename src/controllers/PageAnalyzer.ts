import { Request, Response } from 'express';

class PageAnalyzer {
    static runTest = async (req: Request, res: Response) => {
        res.send('success runTest');
    }
}

export default PageAnalyzer;