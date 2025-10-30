// src/repositories/review.repository.js
import { pool } from "../db.config.js";

export const addReview = async ({ userId, storeId, body, score }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO review (user_id, store_id, body, score)
       VALUES (?, ?, ?, ?);`,
      [userId, storeId, body, score]
    );
    return result.insertId; // 새 리뷰 PK
  } catch (err) {
    throw new Error(
      `리뷰 추가 중 오류가 발생했어요. 요청 데이터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

export const getReviewById = async (reviewId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT id, user_id, store_id, body, score, created_at
       FROM review
       WHERE id = ?;`,
      [reviewId]
    );

    if (rows.length === 0) return null;
    return rows[0];
  } finally {
    conn.release();
  }
};
