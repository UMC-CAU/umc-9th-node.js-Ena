import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addReviewToStoreService } from '../services/review.service.js';

export const handleAddReviewToStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await addReviewToStoreService(req.body, req.params.storeId);
    res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    next(err);
  }
};
