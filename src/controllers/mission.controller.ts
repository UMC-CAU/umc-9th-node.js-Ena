import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addMissionService, listStoreMissions } from '../services/mission.service.js';
import { InvalidMissionStoreIdError } from '../error.js';

export const handleAddMission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await addMissionService(req.body);

    // ✅ 공통 성공 응답 포맷 사용
    return res.status(StatusCodes.CREATED).success(result);
  } catch (err) {
    next(err);
  }
};

export const handleGetStoreMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) storeId 파싱
    const raw = String(req.params.storeId ?? '');
    const digits = raw.replace(/[^\d]/g, ''); // 비숫자 제거
    const storeId = digits ? parseInt(digits, 10) : NaN;

    if (!Number.isInteger(storeId)) {
      // ✅ 커스텀 Error 사용
      throw new InvalidMissionStoreIdError('storeId가 올바르지 않습니다.', {
        raw,
      });
    }
    const cursor =
      req.query.cursor !== undefined ? Number(req.query.cursor) : null;
    const size =
      req.query.size !== undefined
        ? Math.min(Number(req.query.size), 50)
        : 5;

    const out = await listStoreMissions(storeId, { cursor, size });

    // ✅ 성공 응답도 통일
    return res.status(StatusCodes.OK).success(out);
  } catch (e) {
    next(e);
  }
};