import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { bodyToStore } from '../dtos/store.dto.js';
import { addStoreService, listStoreReviews } from '../services/store.service.js';

export const handleAddStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = bodyToStore(req.body);
    // 이번 주차 가정: “특정 사용자(예: 첫 번째 사용자)”로 처리해야 한다면
    // 필요 시 userId를 하드코딩/조회해서 store 생성자 기록 등을 남길 수 있음.
    const created = await addStoreService(dto);
    res.status(StatusCodes.CREATED).json({ result: created });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/stores/:storeId/reviews?cursor=10&size=5
export const handleListStoreReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = Number(req.params.storeId);
    const cursor  = req.query.cursor ? Number(req.query.cursor) : null;
    const size    = req.query.size ? Math.min(Number(req.query.size), 50) : 5; // 상한

    // "내 리뷰만" 옵션 — 이번 주차 가정(첫 번째 사용자) or 세션에서 userId
    const mine = String(req.query.mine ?? '') === '1';
    const userId = mine;

    const options: any = { cursor, size };
    if (mine) options.userId = userId;

    const out = await listStoreReviews(storeId, options);
    res.status(200).json(out);
  } catch (e) { next(e); }
};

