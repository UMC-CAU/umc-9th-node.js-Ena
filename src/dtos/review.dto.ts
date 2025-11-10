export interface ReviewBody {
  body: string;
  score?: number; // 선택
}

export interface ReviewDTO {
  storeId: number;
  userId: number;   // 이번 주차는 "첫 번째 사용자"로 채움
  body: string;
  score?: number;
}

export const bodyToReview = (raw: any, storeIdParam: any, userId: number): ReviewDTO => {
  const storeId = Number(storeIdParam);
  if (!Number.isInteger(storeId)) throw new Error('storeId가 올바르지 않습니다.');
  if (!raw || typeof raw.body !== 'string' || raw.body.trim().length === 0) {
    throw new Error('content는 필수입니다.');
  }
  if (raw.score !== undefined && !Number.isInteger(raw.score)) {
    throw new Error('score는 정수여야 합니다.');
  }

  return {
    storeId,
    userId,
    body: raw.body.trim(),
    score: raw.score
  };
};
