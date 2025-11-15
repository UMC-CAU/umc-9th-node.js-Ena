import { prisma } from '../libs/prisma.js';

export const getFirstUserId = async (): Promise<number | null> => {
  const row = await prisma.user.findFirst({
    orderBy: { id: 'asc' },
    select: { id: true },
  });
  return row?.id ?? null;
};

export const createReview = async (data: {
  storeId: number;
  userId: number;
  body: string;
  score: number;
}): Promise<number> => {
  const row = await prisma.review.create({
    data: {
      storeId: data.storeId,
      userId: data.userId,
      body: data.body,
      score: data.score,
    },
    select: { id: true },
  });
  return row.id;
};

export const getReviewById = async (id: number) => {
  return prisma.review.findUnique({
    where: { id },
    select: {
      id: true,
      storeId: true,
      userId: true,
      body: true,
      score: true,
      createdAt: true,
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
    orderBy: { id: 'desc' },
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