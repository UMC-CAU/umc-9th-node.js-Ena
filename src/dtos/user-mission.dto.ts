export interface StartMissionDTO {
  userId: number;     // 이번 주: 첫 번째 사용자로 채움
  missionId: number;  // path param로 받음
}

export const paramToStartMission = (missionIdParam: any, userId: number): StartMissionDTO => {
  const missionId = Number(missionIdParam);
  if (!Number.isInteger(missionId)) throw new Error('missionId가 올바르지 않습니다.');
  return { userId, missionId };
};

export interface UserMissionResponse {
  id: number;
  userId: number;
  missionId: number;
    status: 'ongoing' | 'completed';
  startedAt: string;
  completedAt: string | null;
}

export const userMissionsResponse = (
  rows: Array<{
    id: number | bigint;
    userId: number | bigint;
    missionId: number | bigint;
    status: 'ongoing' | 'completed';
    startedAt: Date;
    completedAt: Date | null;
  }>,
  nextCursor: number | null
) => ({
  data: rows.map(r => ({
    id: Number(r.id),
    userId: Number(r.userId),
    missionId: Number(r.missionId),
    status: r.status,
    startedAt: r.startedAt.toISOString(),
    completedAt: r.completedAt ? r.completedAt.toISOString() : null,
  })),
  pagination: { cursor: nextCursor },
});
