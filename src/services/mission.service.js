// src/services/mission.service.js
import { getStoreById } from "../repositories/store.repository.js";
import { addMission, getMissionById } from "../repositories/mission.repository.js";

export const createMissionForStore = async (data) => {
  const {
    storeId,
    regionId,
    points,
    deadline,
    details,
    minCost,
  } = data;

  // 1. 가게 유효성 체크
  const store = await getStoreById(storeId);
  if (!store) {
    throw new Error("존재하지 않는 가게입니다.");
  }

  // (선택) regionId 검증 로직도 만들 수 있어:
  // 예: regionId가 실제 region 테이블에 있는지 확인
  // const regionOk = await checkRegionExists(regionId);
  // if (!regionOk) {
  //   throw new Error("존재하지 않는 지역입니다.");
  // }

  // 2. 미션 추가
  const newMissionId = await addMission({
    storeId,
    regionId,
    points,
    deadline,
    details,
    minCost,
  });

  // 3. 방금 생성된 미션 다시 조회
  const mission = await getMissionById(newMissionId);

  return mission;
};
