// src/repositories/mission.repository.js
import { pool } from "../db.config.js";

export const addMission = async ({
  storeId,
  regionId,
  points,
  deadline,
  details,
  minCost,
}) => {
  const conn = await pool.getConnection();

  try {
    const [result] = await conn.query(
      `INSERT INTO mission
        (store_id, region_id, points, deadline, details, created_at, updated_at, min_cost)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?);`,
      [storeId, regionId, points, deadline, details, minCost]
    );

    // AUTO_INCREMENT인 경우 insertId 사용 가능
    return result.insertId;
  } catch (err) {
    throw new Error(
      `미션 추가 중 오류가 발생했어요. 요청 데이터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const getMissionById = async (missionId) => {
  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.query(
      `SELECT id, store_id, region_id, points, deadline, details, created_at, updated_at, min_cost
       FROM mission
       WHERE id = ?;`,
      [missionId]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } finally {
    conn.release();
  }
};
