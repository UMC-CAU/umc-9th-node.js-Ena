// src/dtos/store.response.ts
export interface StoreResponse {
  id: number;
  regionId: number;
  name: string;
  address: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export const storeToResponse = (row: {
  id: number;
  region_id: number;
  name: string;
  address: string;
  category: string;
  created_at: Date;
  updated_at: Date;
}): StoreResponse => ({
  id: row.id,
  regionId: row.region_id,
  name: row.name,
  address: row.address,
  category: row.category,
  createdAt: new Date(row.created_at).toISOString(),
  updatedAt: new Date(row.updated_at).toISOString(),
});

export interface StoreBody {
  regionId: number;
  name: string;
  address: string;
  category: string; // enum으로 좁혀도 됨
}

export interface StoreDTO {
  regionId: number;
  name: string;
  address: string;
  category: string;
}

export const bodyToStore = (raw: any): StoreDTO => {
  if (!raw || typeof raw !== 'object') {
    throw new Error('요청 바디가 비어있거나 형식이 아닙니다.');
  }
  if (!Number.isInteger(raw.regionId)) {
    throw new Error('regionId는 정수여야 합니다.');
  }
  if (typeof raw.name !== 'string' || raw.name.trim().length === 0) {
    throw new Error('name은 필수입니다.');
  }
  if (typeof raw.address !== 'string' || raw.address.trim().length === 0) {
    throw new Error('address는 필수입니다.');
  }
  if (typeof raw.category !== 'string' || raw.category.trim().length === 0) {
    throw new Error('category는 필수입니다.');
  }

  return {
    regionId: raw.regionId,
    name: raw.name.trim(),
    address: raw.address.trim(),
    category: raw.category.trim(),
  };
};
export interface Review {
    id: number;
    [key: string]: unknown;
}

export interface ReviewsPagination {
    cursor: number | null;
}

export interface ReviewsResponse {
    data: Review[];
    pagination: ReviewsPagination;
}

export const responseFromReviews = (
  reviews: Array<{
    id: number | bigint;
    content: string;
    score: number | null;
    created_at: Date;
    user: { id: number | bigint; name: string } | null;
  }>,
  nextCursor: number | null
) => ({
  data: reviews.map(r => ({
    id: Number(r.id),
    authorId: r.user ? Number(r.user.id) : null,
    autherName: r.user?.name ?? '알 수 없음',
    content: r.content,
    score: r.score ?? null,
    createdAt: r.created_at.toISOString(),
  })),
  pagination: { cursor: nextCursor }, // null이면 끝
});
