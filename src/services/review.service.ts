import { bodyToReview } from '../dtos/review.dto.js';
import { reviewToResponse } from '../dtos/response.dto.js';
import { createReview, getFirstUserId, getReviewById, getStoreExists } from '../repositories/review.repository.js';

export const addReviewToStoreService = async (rawBody: any, storeIdParam: any) => {
  // 1) 가정: 첫 번째 사용자 사용
  const userId = await getFirstUserId();
  if (!userId) throw new Error('사용자가 존재하지 않습니다. 먼저 사용자부터 생성하세요.');

  // 2) 입력 DTO 파싱
  const dto = bodyToReview(rawBody, storeIdParam, userId);

  // 3) 가게 존재 검증
  const exists = await getStoreExists(dto.storeId);
  if (!exists) throw new Error('존재하지 않는 가게입니다.');

  // 4) 생성
  if (dto.score === undefined || typeof dto.score !== 'number') throw new Error('평점(score)이 필요합니다.');
  const reviewId = await createReview({
    storeId: dto.storeId,
    userId: dto.userId,
    body: dto.body,
    score: dto.score
  });

  // 5) 조회 후 응답 변환
  const row = await getReviewById(reviewId);
if (!row) throw new Error('리뷰를 찾을 수 없습니다.');

const mapped = {
    id: row.id,
    store_id: row.storeId,
    user_id: row.userId,
    content: row.body,
    // Decimal (Prisma)일 경우 toNumber(), 아니면 Number()로 변환. null 허용.
    score:
        (row.score as any) == null
            ? null
            : typeof (row.score as any).toNumber === 'function'
            ? (row.score as any).toNumber()
            : Number(row.score),
    // createdAt이 null일 수 있으므로 기본값으로 현재 시간 사용 (필요하면 변경)
    created_at: row.createdAt ?? new Date()
};

return reviewToResponse(mapped);
};
