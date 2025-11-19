// 미션 생성용 DTO

export interface MissionBody {
  storeId: number | string;
  regionId: number | string;
  points: number | string;
  minCost: number | string;
  deadline: string | Date;     // e.g. "2025-12-31T23:59:59"
}

export interface MissionCreateDTO {
  storeId: number;
  regionId: number;
  points: number;
  minCost: number;
  deadline: Date;
}

export const bodyToMission = (body: MissionBody): MissionCreateDTO => {
  const toInt = (v: any, name: string) => {
    const n = typeof v === 'string' ? parseInt(v, 10) : v;
    if (!Number.isInteger(n)) throw new Error(`${name}는 정수여야 합니다.`);
    return n;
  };

  const storeId  = toInt(body.storeId, 'storeId');
  const regionId = toInt(body.regionId, 'regionId');
  const points   = toInt(body.points, 'points');
  const minCost  = toInt(body.minCost, 'minCost');

  if (points <= 0) throw new Error('points는 양의 정수여야 합니다.');
  if (minCost < 0) throw new Error('minCost는 0 이상 정수여야 합니다.');

  const deadline = body.deadline instanceof Date ? body.deadline : new Date(body.deadline);
  if (Number.isNaN(deadline.getTime())) throw new Error('deadline 형식이 올바르지 않습니다.');

  return { storeId, regionId, points, minCost, deadline };
};

export const missionsResponse = (
  missions: Array<{
    id: number | bigint;
    store_id: number | bigint;
    region_id: number | bigint;
    points: number;
    min_cost: number;
    deadline: Date;
    created_at: Date;
    updated_at: Date;
  }>,
  nextCursor: number | null
) => ({
  data: missions.map(m => ({
    id: Number(m.id),
    storeId: Number(m.store_id),
    regionId: Number(m.region_id),
    points: m.points,
    minCost: m.min_cost,
    deadline: m.deadline.toISOString(),
    createdAt: m.created_at.toISOString(),
    updatedAt: m.updated_at.toISOString(),
  })),
  pagination: { cursor: nextCursor },
});
