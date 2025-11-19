import { prisma } from '../libs/prisma.js';

export const createMission = async (data: {
  storeId: number;
  regionId: number;
  points: number;
  minCost: number;
  deadline: Date;
}): Promise<number> => {
  const row = await prisma.mission.create({
    data: {
      storeId: data.storeId,
      regionId: data.regionId,
      points: data.points,
      minCost: data.minCost,
      deadline: data.deadline,
    },
    select: { id: true },
  });
  return row.id;
};

export const getMissionById = async (missionId: number) => {
  return prisma.mission.findUnique({
    where: { id: missionId },
    select: {
      id: true,
      storeId: true,
      regionId: true,
      points: true,
      minCost: true,
      deadline: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const getStoreMissions = async (
  storeId: number,
  opt: { cursor: number | null; size: number }
) => {
  const take = opt.size + 1;
  const where: any = { storeId, ...(opt.cursor ? { id: { gt: opt.cursor } } : {}) };

  const rows = await prisma.mission.findMany({
    where,
    orderBy: { id: 'asc' },
    take,
    select: {
      id: true,
      storeId: true,
      regionId: true,
      points: true,
      minCost: true,
      deadline: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  let nextCursor: number | null = null;
  if (rows.length > opt.size) {
    const last = rows.pop()!;
    nextCursor = Number(last.id);
  }
  return { rows, nextCursor };
};

