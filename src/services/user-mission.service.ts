import { paramToStartMission, userMissionsResponse } from '../dtos/user-mission.dto.js';
import { userMissionToResponse } from '../dtos/response.dto.js';
import {
  createUserMission,
  getFirstUserId,
  getUserMissionById,
  isAlreadyInProgress,
  missionExists, 
  getUserMissions
} from '../repositories/user-mission.repository.js';

export const startMissionService = async (missionIdParam: any) => {
  // 0) 가정: 특정 사용자(첫 번째 사용자)
  const userId = await getFirstUserId();
  if (!userId) throw new Error('사용자가 존재하지 않습니다. 먼저 사용자부터 생성하세요.');

  // 1) 입력 파싱
  const dto = paramToStartMission(missionIdParam, userId);

  // 2) 미션 존재 검증
  const exists = await missionExists(dto.missionId);
  if (!exists) throw new Error('존재하지 않는 미션입니다.');

  // 3) 이미 in_progress 인지 검증
  const dup = await isAlreadyInProgress(dto.userId, dto.missionId);
  if (dup) throw new Error('이미 도전 중인 미션입니다.');

  // 4) 생성
  const id = await createUserMission(dto.userId, dto.missionId);

  // 5) 조회 후 응답 변환
  const row = await getUserMissionById(id);
  if (!row) throw new Error('user_mission 생성 직후 조회에 실패했습니다.');

  return userMissionToResponse({
    id: row.id,
    user_id: row.userId,
    mission_id: row.missionId,
    status: row.status,
    started_at: row.startedAt!,
    completed_at: row.completedAt
  });
};

export const listMyMissions = async (
  userId: number,
  opt: { status: 'ongoing' | 'completed'; cursor: number | null; size: number }
) => {
  // DB 조회
  const { rows, nextCursor } = await getUserMissions(userId, opt);

  // 1) 간단 응답 (user_mission 중심)
  const safeRows = rows.map(r => ({
    ...r,
    startedAt: r.startedAt!
  }));

  return userMissionsResponse(safeRows, nextCursor);

};
