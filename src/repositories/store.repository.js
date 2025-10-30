// src/repositories/store.repository.js
import { pool } from "../db.config.js";

// 지역 존재 여부 확인
export const checkRegionExists = async (regionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id FROM region WHERE id = ?;",
      [regionId]
    );
    return rows.length > 0;
  } finally {
    conn.release();
  }
};

// 가게 추가
export const addStore = async ({ regionId, name, address, category }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO store (region_id, name, address, category)
       VALUES (?, ?, ?, ?);`,
      [regionId, name, address, category]
    );
    return result.insertId; // 새로 만든 store의 PK
  } catch (err) {
    throw new Error(
      `가게 추가 중 오류가 발생했어요. 요청 데이터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 방금 추가한 가게 정보 조회 (응답용으로 깔끔하게 주고 싶다면)
export const getStoreById = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, region_id, name, address, category
       FROM store
       WHERE id = ?;`,
      [storeId]
    );
    if (rows.length === 0) return null;
    return rows[0];
  } finally {
    conn.release();
  }
};
