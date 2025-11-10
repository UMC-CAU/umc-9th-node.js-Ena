// ---------- User ----------
export const responseFromUser = (args: {
  user: { email: string; name: string };
  preferences: Array<{ name: string }>;
}) => {
  return {
    email: args.user.email,
    name: args.user.name,
    preferCategory: args.preferences.map((p) => p.name),
  };
};

// ---------- Store ----------
export interface StoreResponse {
  id: number;
  regionId: number;
  name: string;
  address: string;
  category: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export const storeToResponse = (row: {
  id: number | bigint;
  // 둘 중 하나만 오게 허용
  region_id?: number | bigint;
  regionId?: number | bigint;
  name: string;
  address: string;
  category: string;
  created_at: Date;
  updated_at: Date;
}) => ({
  id: Number(row.id),
  regionId: Number(row.region_id ?? row.regionId!), // ← 둘 중 있는 값 사용
  name: row.name,
  address: row.address,
  category: row.category,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString(),
});

// ---------- Review ----------
export interface ReviewResponse {
  id: number;
  storeId: number;
  userId: number;
  content: string;          // ← field 이름 'content'로 통일 (mysql2에서 body였다면 코드도 같이 변경)
  score: number | null;
  createdAt: string;
}

export const reviewToResponse = (row: {
  id: number | bigint;
  store_id: number | bigint;
  user_id: number | bigint;
  content: string;
  score: number | null;
  created_at: Date;
}): ReviewResponse => ({
  id: Number(row.id),
  storeId: Number(row.store_id),
  userId: Number(row.user_id),
  content: row.content,
  score: row.score,
  createdAt: row.created_at.toISOString(),
});

// ---------- Mission ----------
export interface MissionResponse {
  id: number;
  storeId: number;
  regionId: number;
  points: number;
  minCost: number;
  deadline: string; // ISO
  createdAt: string;
  updatedAt: string;
}

export const missionToResponse = (m: {
  id: number | bigint;
  store_id: number | bigint;
  region_id: number | bigint;
  points: number;
  min_cost: number;
  deadline: Date;
  created_at: Date;
  updated_at: Date;
}): MissionResponse => ({
  id: Number(m.id),
  storeId: Number(m.store_id),
  regionId: Number(m.region_id),
  points: m.points,
  minCost: m.min_cost,
  deadline: m.deadline.toISOString(),
  createdAt: m.created_at.toISOString(),
  updatedAt: m.updated_at.toISOString(),
});

// ---------- UserMission ----------
export interface UserMissionResponse {
  id: number;
  userId: number;
  missionId: number;
  status: 'ongoing' | 'completed'; // ← Prisma/DB와 동일하게
  startedAt: string;
  completedAt: string | null;
}

export const userMissionToResponse = (row: {
  id: number | bigint;
  user_id: number | bigint;
  mission_id: number | bigint;
  status: 'ongoing' | 'completed';
  started_at: Date;
  completed_at: Date | null;
}): UserMissionResponse => ({
  id: Number(row.id),
  userId: Number(row.user_id),
  missionId: Number(row.mission_id),
  status: row.status,
  startedAt: row.started_at.toISOString(),
  completedAt: row.completed_at ? row.completed_at.toISOString() : null,
});
