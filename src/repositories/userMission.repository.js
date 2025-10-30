// src/repositories/userMission.repository.js
import { pool } from "../db.config.js";

// 유저가 이 미션을 이미 가지고 있는지 확인
export const getUserMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, user_id, mission_id, status, started_at, completed_at
       FROM user_mission
       WHERE user_id = ? AND mission_id = ?;`,
      [userId, missionId]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } finally {
    conn.release();
  }
};

// 새 미션 도전 추가
export const addUserMission = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user_mission (user_id, mission_id, status, started_at)
       VALUES (?, ?, 'ongoing', NOW());`,
      [userId, missionId]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `미션 도전 등록 중 오류가 발생했어요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 진행중 or 완료된 미션 리스트 조회
export const getUserMissionsByStatus = async (userId, status) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT um.id,
              um.mission_id,
              um.status,
              um.started_at,
              um.completed_at,
              m.store_id,
              m.region_id,
              m.points,
              m.deadline,
              m.details,
              m.min_cost
       FROM user_mission um
       JOIN mission m ON um.mission_id = m.id
       WHERE um.user_id = ?
       AND um.status = ?
       ORDER BY um.started_at DESC;`,
      [userId, status]
    );
    return rows;
  } finally {
    conn.release();
  }
};
