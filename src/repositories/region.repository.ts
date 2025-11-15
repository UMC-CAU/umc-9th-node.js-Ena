import { prisma } from '../libs/prisma.js';

export const getRegionExists = async (regionId: number): Promise<boolean> => {
  const row = await prisma.region.findUnique({
    where: { id: regionId },        // ← schema.prisma의 모델 필드명(camelCase) 기준
    select: { id: true },
  });
  return !!row;
};