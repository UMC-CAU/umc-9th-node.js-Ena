import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addReviewToStoreService } from '../services/review.service.js';

export const handleAddReviewToStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await addReviewToStoreService(req.body, req.params.storeId);

    // ✅ 공통 성공 응답 포맷 사용
    return res.status(StatusCodes.CREATED).success(result);
  } catch (err) {
    next(err);
  }
};
