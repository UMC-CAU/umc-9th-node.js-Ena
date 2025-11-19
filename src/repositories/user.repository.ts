import { prisma } from '../libs/prisma.js';

type Gender = '남성' | '여성';

export const addUser = async (data: {
  email: string;
  password: string; // 해시된 비번(선택)
  name: string;
  gender: '남성' | '여성';
  birth: Date;
  address?: string;
  detailAddress?: string;
  phoneNumber?: string;
}): Promise<number | null> => {
  // 이메일 중복 확인
  const exist = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (exist?.id) return null;

  const row = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password ?? null,
      name: data.name,
      gender: data.gender, // Enum 매핑은 introspect 결과에 맞춰야 함
      birth: data.birth,
      address: data.address ?? null,
      detailAddress: data.detailAddress ?? null,
      phoneNumber: data.phoneNumber ?? null,
    },
    select: { id: true },
  });
  return row.id;
};

export const getUser = async (userId: number) => {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      gender: true,
      birth: true,
      address: true,
      detailAddress: true,
      phoneNumber: true,
    },
  });
  if (!row) return null;
  // 기존 서비스/DTO가 배열 반환을 기대했다면 맞춰서 래핑
  return row;
};

export const setPreference = async (userId: number, foodCategoryId: number): Promise<void> => {
  await prisma.userFavorCategory.create({
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

export const getUserPreferencesByUserId = async (userId: number) => {
  const rows = await prisma.userFavorCategory.findMany({
    where: { userId: userId },
    orderBy: { foodCategoryId: 'asc' },
    select: {
      id: true,
      foodCategoryId: true,
      userId: true,
      foodCategory: { select: { name: true } }, // relation alias는 introspect 결과에 맞춰 조정 필요
    },
  });

  // introspect 시 relation 이름이 다를 수 있음.
  // 만약 relation 이름이 `food_category`라면 아래처럼 매핑:
  // fcl?.name → food_category?.name 로 바꿔주세요.
  return rows.map((r: any) => ({
    id: r.id,
    food_category_id: r.food_category_id,
    user_id: r.user_id,
    name: r.fcl?.name ?? r.food_category?.name ?? '', // 안전 매핑
  }));
};
