import { prisma } from '../libs/prisma.js';

export const getFirstUserId = async (): Promise<number | null> => {
  const row = await prisma.user.findFirst({
    orderBy: { id: 'asc' },
    select: { id: true },
  });
  return row?.id ?? null;
};

export const getStoreExists = async (storeId: number): Promise<boolean> => {
  const row = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true },
  });
  return Boolean(row?.id);
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