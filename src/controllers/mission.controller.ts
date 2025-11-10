import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addMissionService, listStoreMissions } from '../services/mission.service.js';

export const handleAddMission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await addMissionService(req.body);
    res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    next(err);
  }
};

export const handleGetStoreMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) 원본
    const raw = String(req.params.storeId ?? '');

    const digits = raw.replace(/[^\d]/g, ''); // 모든 비숫자 제거
    const storeId = digits ? parseInt(digits, 10) : NaN;
    
    if (!Number.isInteger(storeId)) throw new Error('storeId가 올바르지 않습니다.');
    const cursor  = req.query.cursor ? Number(req.query.cursor) : null;
    const size    = req.query.size ? Math.min(Number(req.query.size), 50) : 5;

    const out = await listStoreMissions(storeId, { cursor, size });
    res.status(200).json(out);
  } catch (e) { next(e); }
};