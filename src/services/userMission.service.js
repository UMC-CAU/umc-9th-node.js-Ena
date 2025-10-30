import { getMissionById } from "../repositories/mission.repository.js";
import {
  getUserMission,
  addUserMission,
} from "../repositories/userMission.repository.js";

export const challengeMission = async ({ userId, missionId }) => {
  // 1. 미션 존재 여부 확인
  const mission = await getMissionById(missionId);
  if (!mission) {
    throw new Error("존재하지 않는 미션입니다.");
  }

  // 2. 이미 도전하고 있는지 확인
  const existing = await getUserMission(userId, missionId);

  if (existing) {
    // 이미 row가 있다 = 이 유저는 이 미션에 대해 ongoing거나 completed거나 뭔가 상태가 있다
    // 여기서 정책을 어떻게 할지 정할 수 있어.
    // 보통은 진행중이면 막고, completed이면 재도전 허용할지 말지 정해야 함.
    // 과제 조건은 "이미 도전 중인지"니까 ongoing만 막으면 된다.
    if (existing.status === "ongoing") {
      throw new Error("이미 도전 중인 미션입니다.");
    }

    // 만약 completed도 막고 싶다면 여기서도 막으면 되고,
    // completed는 다시 도전 허용하고 싶다면 아래 addUserMission 대신 그냥 existing 리턴하거나 정책정의.
  }

  // 3. 새로 도전 row 추가
  const newUserMissionId = await addUserMission(userId, missionId);

  // 선택: 방금 insert한 내용 다시 보고 싶으면 getUserMission 호출해서 리턴해도 된다.
  const created = await getUserMission(userId, missionId);
  return created;
};

import { getUserMissionsByStatus } from "../repositories/userMission.repository.js";

export const getUserMissions = async ({ userId, status }) => {
  // status는 ongoing | completed 둘 중 하나라고 가정
  // 잘못된 status 들어오면 막는 것도 여기서 가능
  if (status !== "ongoing" && status !== "completed") {
    throw new Error("잘못된 상태 값입니다.");
  }

  const missions = await getUserMissionsByStatus(userId, status);
  return missions;
};
