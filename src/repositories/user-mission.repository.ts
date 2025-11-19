import { prisma } from '../libs/prisma.js';

export const getFirstUserId = async (): Promise<number | null> => {
  const row = await prisma.user.findFirst({
    orderBy: { id: 'asc' },
    select: { id: true },
  });
  return row?.id ?? null;
};

export const missionExists = async (missionId: number): Promise<boolean> => {
  const row = await prisma.mission.findUnique({
    where: { id: missionId },
    select: { id: true },
  });
  return Boolean(row?.id);
};

export const isAlreadyInProgress = async (userId: number, missionId: number): Promise<boolean> => {
  const row = await prisma.userMission.findFirst({
    where: {
      userId: userId,
      missionId: missionId,
      status: 'ongoing',
    },
    select: { id: true },
  });
  return Boolean(row?.id);
};

export const createUserMission = async (userId: number, missionId: number): Promise<bigint> => {
  const row = await prisma.userMission.create({
    data: {
      userId: userId,
      missionId: missionId,
      status: 'ongoing',
      // started_at은 디폴트 now()
    },
    select: { id: true },
  });
  return row.id;
};

export const getUserMissionById = async (id: bigint) => {
  return prisma.userMission.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      missionId: true,
      status: true,
      startedAt: true,
      completedAt: true,
    },
  });
};

// user_mission + mission + store 요약까지 한 번에
export const getUserMissions = async (
  userId: number,
  opt: { status: 'ongoing' | 'completed'; cursor: number | null; size: number }
) => {
  const take = opt.size + 1;

  const where: any = {
    userId,                             // ← Prisma 모델 필드명(camelCase) 사용!
    status: opt.status,
    ...(opt.cursor ? { id: { gt: opt.cursor } } : {}),
  };

  const rows = await prisma.userMission.findMany({
    where,
    orderBy: { id: 'asc' },
    take,
    select: {
      id: true,
      userId: true,
      missionId: true,
      status: true,
      startedAt: true,
      completedAt: true,
    },
  });

  let nextCursor: number | null = null;
  if (rows.length > opt.size) {
    const last = rows.pop()!;
    nextCursor = Number(last.id);
  }
  return { rows, nextCursor };
};
