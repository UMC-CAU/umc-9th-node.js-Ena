// src/controllers/userMission.controller.js
import { StatusCodes } from "http-status-codes";
import { challengeMission, getUserMissions } from "../services/userMission.service.js";

export const handleChallengeMission = async (req, res, next) => {
  try {
    const missionId = Number(req.params.missionId);

    // 로그인/인증 없으니까 일단 하드코딩
    const userId = 1;

    const result = await challengeMission({
      userId,
      missionId,
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ result });
  } catch (err) {
    console.error(err.message);

    if (err.message === "존재하지 않는 미션입니다.") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: err.message });
    }

    if (err.message === "이미 도전 중인 미션입니다.") {
      return res
        .status(StatusCodes.CONFLICT) // 409 충돌
        .json({ error: err.message });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "서버 내부 오류가 발생했습니다." });
  }
};
export const handleGetUserMissions = async (req, res, next) => {
  try {
    // Authorization: Bearer <JWT> 에서 userId를 꺼내는 게 이상적이지만
    // 아직 안 붙었으니까 하드코딩
    const userId = 1;

    const status = req.query.status || "ongoing";

    const missions = await getUserMissions({
      userId,
      status,
    });

    return res
      .status(StatusCodes.OK)
      .json({ result: missions });
  } catch (err) {
    console.error(err.message);

    if (err.message === "잘못된 상태 값입니다.") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: err.message });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "서버 내부 오류가 발생했습니다." });
  }
};
