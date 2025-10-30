// src/controllers/review.controller.js
import { StatusCodes } from "http-status-codes";
import { createReviewForStore } from "../services/review.service.js";

export const handleAddReviewToStore = async (req, res, next) => {
  try {
    console.log("리뷰 추가 요청 params/body:", req.params, req.body);

    const storeIdFromPath = req.params.storeId;
    const fixedUserId = 1; // 로그인 없으니까 임시 고정

    const review = await createReviewForStore({
      userId: fixedUserId,
      storeId: Number(storeIdFromPath),
      body: req.body.body,
      score: req.body.score,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ result: review });
  } catch (err) {
    console.error(err.message);

    if (err.message === "존재하지 않는 가게입니다.") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: err.message });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "서버 내부 오류가 발생했습니다." });
  }
};
