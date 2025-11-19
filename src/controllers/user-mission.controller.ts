import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { startMissionService, listMyMissions } from '../services/user-mission.service.js';
import { getFirstUserId } from '../repositories/user-mission.repository.js';
import { NoCurrentUserForMyMissionsError } from '../error.js';

export const handleStartMission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await startMissionService(req.params.missionId);

    // ✅ 공통 성공 응답 포맷
    return res.status(StatusCodes.CREATED).success(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/missions/my?status=in_progress&cursor=10&size=5
export const handleListMyMissions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 이번 주차: 세션/토큰이 없으므로 “첫 번째 사용자”를 가정
    const userId = await getFirstUserId(); // repositories/common.helper.ts 등
    if (!userId) {
      throw new NoCurrentUserForMyMissionsError(
        '사용자가 없습니다. 먼저 회원가입을 해주세요.',
      );
    }

    // status 기본값: in_progress
    const statusQ = String(req.query.status ?? 'ongoing');
    const status: 'ongoing' | 'completed' = statusQ === 'completed' ? 'completed' : 'ongoing';

    const cursor =
      typeof req.query.cursor === 'string' && /^\d+$/.test(req.query.cursor)
        ? parseInt(req.query.cursor, 10)
        : null;

    const size =
      typeof req.query.size === 'string' && /^\d+$/.test(req.query.size)
        ? Math.min(parseInt(req.query.size, 10), 50)
        : 5;

    const out = await listMyMissions(userId, { status, cursor, size });
    
    // ✅ 공통 성공 응답 포맷
    return res.status(StatusCodes.OK).success(out);
  } catch (e) {
    next(e);
  }
};
