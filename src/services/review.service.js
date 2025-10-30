import { getStoreById } from "../repositories/store.repository.js";
import { addReview, getReviewById } from "../repositories/review.repository.js";

export const createReviewForStore = async (data) => {
  const { userId, storeId, body, score } = data;

  // 1. 가게가 실제 존재하는지 확인
  const store = await getStoreById(storeId);
  if (!store) {
    // 비즈니스 규칙: 없는 가게에 리뷰 달면 안 돼
    throw new Error("존재하지 않는 가게입니다.");
  }

  // 2. 리뷰 INSERT
  const newReviewId = await addReview({
    userId,
    storeId,
    body,
    score,
  });

  // 3. 방금 작성한 리뷰 다시 조회해서 응답으로 돌려줄 수 있게
  const review = await getReviewById(newReviewId);

  return review;
};
