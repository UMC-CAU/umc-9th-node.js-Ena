//import { pool } from '../db.config.js';
import { prisma } from '../libs/prisma.js';

export const getRegionById = async (regionId: number) => {
  return prisma.region.findUnique({
    where: { id: regionId },
    select: { id: true, name: true },
  });
};

export const createStore = async (data: {
  regionId: number;
  name: string;
  address: string;
  category: string;
}): Promise<number> => {
  const row = await prisma.store.create({
    data: {
      regionId: data.regionId,
      name: data.name,
      address: data.address,
      category: data.category,
      // created_at/updated_at은 DB 디폴트/updatedAt로 자동
    },
    select: { id: true },
  });
  return row.id;
};

export const getStoreById = async (storeId: number) => {
  return prisma.store.findUnique({
    where: { id: storeId },
    select: {
      id: true,
      regionId: true,
      name: true,
      address: true,
      category: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const getStoreReviews = async (
  storeId: number,
  opt: { cursor: number | null; size: number }
) => {
  const take = opt.size + 1; // 다음 페이지 존재여부 판단용
  const where = {
    storeId: storeId,
    ...(opt.cursor ? { id: { gt: opt.cursor } } : {}),
  };

  const rows = await prisma.review.findMany({
    where,
    orderBy: { id: 'asc' },
    take,
    select: {
      id: true,
      body: true,
      score: true,
      createdAt: true,
      user: { select: { id: true, name: true } },     // 닉네임
      // store: { select: { id: true, name: true } }, // 필요시
    },
  });

  let nextCursor: number | null = null;
  if (rows.length > opt.size) {
    const last = rows.pop()!;               // 초과분 제거
    nextCursor = Number(last.id);
  }

  return { rows, nextCursor };
};
