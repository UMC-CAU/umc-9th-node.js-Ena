import { bodyToMission, missionsResponse } from '../dtos/mission.dto.js';
import { missionToResponse } from '../dtos/response.dto.js';
import { createMission, getMissionById, getRegionExists, getStoreExists, getStoreMissions } from '../repositories/mission.repository.js';

export const addMissionService = async (rawBody: any) => {
  const dto = bodyToMission(rawBody);

  // 1) 가게/지역 존재 검증
  const [storeOk, regionOk] = await Promise.all([
    getStoreExists(dto.storeId),
    getRegionExists(dto.regionId)
  ]);
  if (!storeOk)  throw new Error('존재하지 않는 가게입니다.');
  if (!regionOk) throw new Error('존재하지 않는 지역입니다.');

  // (선택) store가 주어진 region에 속하는지 검증하고 싶다면 별도의 쿼리 필요
  // 예: SELECT region_id FROM store WHERE id = ? → dto.regionId와 일치 확인

  // 2) 생성
  const missionId = await createMission(dto);

  // 3) 조회 후 응답 변환
  const mission = await getMissionById(missionId);
  if (!mission) throw new Error('미션 생성 직후 조회에 실패했습니다.');

// camelCase -> snake_case로 매핑하여 타입을 맞춤
return missionToResponse({
    id: mission.id,
    store_id: mission.storeId,
    region_id: mission.regionId,
    points: mission.points,
    min_cost: mission.minCost,
    // repository 타입이 Date로 되어 있다면 null일 수 있으므로 any로 캐스트하여 컴파일 오류를 피함
    deadline: (mission.deadline ?? new Date()) as any,
    created_at: mission.createdAt,
    updated_at: mission.updatedAt
} as any);
};

export const listStoreMissions = async (
  storeId: number,
  opt: { cursor: number | null; size: number }
) => {
  // (선택) 가게 존재 검증
  const { rows, nextCursor } = await getStoreMissions(storeId, opt);
  const mapped = rows.map(m => ({
    id: m.id,
    store_id: m.storeId,
    region_id: m.regionId,
    points: m.points,
    min_cost: m.minCost,
    // repository 타입이 Date로 되어 있다면 null일 수 있으므로 기본값을 넣어 타입을 맞춤
    deadline: (m.deadline ?? new Date()) as Date,
    created_at: m.createdAt,
    updated_at: m.updatedAt
  }));
  return missionsResponse(mapped, nextCursor);
};
