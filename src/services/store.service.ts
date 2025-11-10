import { StoreDTO, responseFromReviews } from '../dtos/store.dto.js';
import { createStore, getRegionById, getStoreById, getStoreReviews } from '../repositories/store.repository.js';
import { storeToResponse } from '../dtos/response.dto.js';

export const addStoreService = async (data: StoreDTO) => {
  // 지역 검증
  const region = await getRegionById(data.regionId);
  if (!region) {
    throw new Error('존재하지 않는 지역입니다.');
  }

  const storeId = await createStore(data);

  const store = await getStoreById(storeId);
  if (!store) throw new Error('스토어 생성 직후 조회에 실패했습니다.');

  return storeToResponse(store);
};

export const listStoreReviews = async (
  storeId: number,
  opt: { cursor: number | null; size: number }
) => {
  // (선택) store 존재 검증
  const { rows, nextCursor } = await getStoreReviews(storeId, opt);

  const mapped = rows.map((r) => ({
    id: r.id,
    content: r.body,
    score:
      (r.score as any)?.toNumber?.() ?? (typeof r.score === 'number' ? r.score : null),
    created_at: r.createdAt ?? new Date(),
    user: r.user ?? null,
  }));

  return responseFromReviews(mapped, nextCursor);
};
