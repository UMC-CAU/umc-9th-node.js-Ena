import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { bodyToStore } from '../dtos/store.dto.js';
import { addStoreService, listStoreReviews } from '../services/store.service.js';
import { InvalidStoreIdError } from '../error.js';

export const handleAddStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = bodyToStore(req.body);
    // 이번 주차 가정: “특정 사용자(예: 첫 번째 사용자)”로 처리해야 한다면
    // 필요 시 userId를 하드코딩/조회해서 store 생성자 기록 등을 남길 수 있음.
    const created = await addStoreService(dto);
    return res.status(StatusCodes.CREATED).success(created);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/stores/:storeId/reviews?cursor=10&size=5
export const handleListStoreReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const storeId = Number(req.params.storeId);
    if (Number.isNaN(storeId)) {
      // ✅ 잘못된 storeId도 커스텀 에러로
      throw new InvalidStoreIdError('유효하지 않은 storeId 입니다.', {
        raw: req.params.storeId,
      });
    }

    const cursor =
      req.query.cursor !== undefined ? Number(req.query.cursor) : null;
    const size =
      req.query.size !== undefined
        ? Math.min(Number(req.query.size), 50)
        : 5; // 상한 50

    const mine = String(req.query.mine ?? '') === '1';
    const userId = mine; // TODO: 이후 실제 userId로 변경 예정

    const options: any = { cursor, size };
    if (mine) options.userId = userId;

    const out = await listStoreReviews(storeId, options);

    // ✅ 여기서도 통일된 응답 포맷
    return res.status(StatusCodes.OK).success(out);
  } catch (err) {
    next(err);
  }
};

