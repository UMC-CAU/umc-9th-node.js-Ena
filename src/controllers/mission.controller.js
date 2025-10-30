// src/controllers/mission.controller.js
import { StatusCodes } from "http-status-codes";
import { createMissionForStore } from "../services/mission.service.js";

export const handleAddMissionToStore = async (req, res, next) => {
  try {
    console.log("미션 추가 요청 params/body:", req.params, req.body);

    const storeIdFromPath = req.params.storeId;

    const mission = await createMissionForStore({
      storeId: Number(storeIdFromPath),
      regionId: req.body.regionId,
      points: req.body.points,
      deadline: req.body.deadline, // "2025-12-31T23:59:59" 같은 문자열 → MySQL DATETIME으로 들어감
      details: req.body.details,
      minCost: req.body.minCost,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ result: mission });
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
