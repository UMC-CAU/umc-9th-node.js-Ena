// src/services/store.service.js
import {
  checkRegionExists,
  addStore,
  getStoreById,
} from "../repositories/store.repository.js";

export const createStoreForRegion = async (data) => {
  const { regionId, name, address, category } = data;

  // 1. 지역 유효성 검사
  const regionOk = await checkRegionExists(regionId);
  if (!regionOk) {
    // 지역이 없으면 비즈니스적으로 거절
    // 컨트롤러에서 이 에러를 잡아서 상태코드 400~404 등으로 내려줄 수 있음
    throw new Error("존재하지 않는 지역입니다.");
  }

  // 2. 가게 추가
  const newStoreId = await addStore({ regionId, name, address, category });

  // 3. 방금 추가된 가게 정보 다시 조회
  const store = await getStoreById(newStoreId);

  // 4. 응답으로 넘길 객체(필요하면 DTO로 감싸도 됨)
  return store;
};
