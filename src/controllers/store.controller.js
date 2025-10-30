// src/controllers/store.controller.js
import { StatusCodes } from "http-status-codes";
import { createStoreForRegion } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  try {
    console.log("가게 추가 요청 body:", req.body);

    const store = await createStoreForRegion(req.body);

    return res
      .status(StatusCodes.CREATED)
      .json({ result: store }); // { id, region_id, name, address, category }
  } catch (err) {
    console.error(err.message);

    // 에러 메세지에 따라 상태코드를 다르게 내려도 됨.
    // ex) "존재하지 않는 지역입니다." -> 400
    if (err.message === "존재하지 않는 지역입니다.") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: err.message });
    }

    // 기타 예외
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "서버 내부 오류가 발생했습니다." });
  }
};
