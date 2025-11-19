import { StoreDTO, responseFromReviews } from '../dtos/store.dto.js';
import { getStoreReviews } from '../repositories/review.repository.js';
import { createStore, getRegionById, getStoreById } from '../repositories/store.repository.js';
import { storeToResponse } from '../dtos/response.dto.js';
import { RegionNotFoundError, StoreNotFoundAfterCreateError } from '../error.js';

export const addStoreService = async (data: StoreDTO) => {
  // 1) 지역 검증
  const region = await getRegionById(data.regionId);
  if (!region) {
    throw new RegionNotFoundError('존재하지 않는 지역입니다.', {
      regionId: data.regionId,
    });
  }

  // 2) 스토어 생성
  const storeId = await createStore(data);

  // 3) 생성 직후 조회
  const store = await getStoreById(storeId);
  if (!store) {
    throw new StoreNotFoundAfterCreateError(
      '스토어 생성 직후 조회에 실패했습니다.',
      { storeId }
    );
  }

  // 4) 응답 DTO 변환
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
