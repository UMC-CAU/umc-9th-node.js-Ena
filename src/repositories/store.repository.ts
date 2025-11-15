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

export const getStoreExists = async (storeId: number): Promise<boolean> => {
  const row = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true },
  });
  return Boolean(row?.id);
};


