// src/errors.ts
export abstract class AppError extends Error {
  public abstract readonly errorCode: string;
  public readonly data: unknown;
  public readonly statusCode: number;

  protected constructor(reason: string, data?: unknown, statusCode = 400) {
    super(reason);
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

export class DuplicateUserEmailError extends AppError {
  public readonly errorCode = 'U001';

  constructor(reason = '이미 존재하는 이메일입니다.', data?: unknown) {
    super(reason, data, 400);
    this.name = 'DuplicateUserEmailError';
  }
}

export class UserNotFoundAfterSignUpError extends AppError {
  public readonly errorCode = 'U002';

  constructor(
    reason = '회원가입 직후 사용자 조회에 실패했습니다.',
    data?: unknown,
  ) {
    super(reason, data, 500);
    this.name = 'UserNotFoundAfterSignUpError';
  }
}

// 존재하지 않는 지역
export class RegionNotFoundError extends Error {
  public readonly errorCode = 'R001';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '존재하지 않는 지역입니다.',
    data?: unknown,
    statusCode = 404
  ) {
    super(reason);
    this.name = 'RegionNotFoundError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 스토어 생성 직후 조회 실패
export class StoreNotFoundAfterCreateError extends Error {
  public readonly errorCode = 'S001';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '스토어 생성 직후 조회에 실패했습니다.',
    data?: unknown,
    statusCode = 500
  ) {
    super(reason);
    this.name = 'StoreNotFoundAfterCreateError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// (선택) 잘못된 storeId 요청
export class InvalidStoreIdError extends Error {
  public readonly errorCode = 'S002';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '유효하지 않은 storeId 입니다.',
    data?: unknown,
    statusCode = 400
  ) {
    super(reason);
    this.name = 'InvalidStoreIdError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 리뷰 작성 시 사용할 에러들

// 1) 첫 번째 사용자(가정) 없음
export class FirstUserNotFoundError extends Error {
  public readonly errorCode = 'R001';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '사용자가 존재하지 않습니다. 먼저 사용자부터 생성하세요.',
    data?: unknown,
    statusCode = 400
  ) {
    super(reason);
    this.name = 'FirstUserNotFoundError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 2) 가게가 존재하지 않을 때
export class ReviewStoreNotFoundError extends Error {
  public readonly errorCode = 'R002';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '존재하지 않는 가게입니다.',
    data?: unknown,
    statusCode = 404
  ) {
    super(reason);
    this.name = 'ReviewStoreNotFoundError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 3) 평점(score)이 없거나 잘못된 타입일 때
export class ReviewScoreRequiredError extends Error {
  public readonly errorCode = 'R003';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '평점(score)이 필요합니다.',
    data?: unknown,
    statusCode = 400
  ) {
    super(reason);
    this.name = 'ReviewScoreRequiredError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 4) 생성 후 리뷰를 못 찾았을 때
export class ReviewNotFoundAfterCreateError extends Error {
  public readonly errorCode = 'R004';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '리뷰를 찾을 수 없습니다.',
    data?: unknown,
    statusCode = 500
  ) {
    super(reason);
    this.name = 'ReviewNotFoundAfterCreateError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 미션 생성 시: 가게가 없는 경우
export class MissionStoreNotFoundError extends Error {
  public readonly errorCode = 'M001';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '존재하지 않는 가게입니다.',
    data?: unknown,
    statusCode = 404
  ) {
    super(reason);
    this.name = 'MissionStoreNotFoundError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 미션 생성 시: 지역이 없는 경우
export class MissionRegionNotFoundError extends Error {
  public readonly errorCode = 'M002';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '존재하지 않는 지역입니다.',
    data?: unknown,
    statusCode = 404
  ) {
    super(reason);
    this.name = 'MissionRegionNotFoundError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 미션 생성 후 조회 실패
export class MissionNotFoundAfterCreateError extends Error {
  public readonly errorCode = 'M003';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '미션 생성 직후 조회에 실패했습니다.',
    data?: unknown,
    statusCode = 500
  ) {
    super(reason);
    this.name = 'MissionNotFoundAfterCreateError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// storeId 파라미터가 잘못된 경우
export class InvalidMissionStoreIdError extends Error {
  public readonly errorCode = 'M004';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = 'storeId가 올바르지 않습니다.',
    data?: unknown,
    statusCode = 400
  ) {
    super(reason);
    this.name = 'InvalidMissionStoreIdError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 존재하지 않는 미션
export class MissionNotFoundError extends Error {
  public readonly errorCode = 'M010';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '존재하지 않는 미션입니다.',
    data?: unknown,
    statusCode = 404
  ) {
    super(reason);
    this.name = 'MissionNotFoundError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// 이미 도전 중인 미션
export class MissionAlreadyInProgressError extends Error {
  public readonly errorCode = 'UM001';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '이미 도전 중인 미션입니다.',
    data?: unknown,
    statusCode = 400
  ) {
    super(reason);
    this.name = 'MissionAlreadyInProgressError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// user_mission 생성 후 조회 실패
export class UserMissionNotFoundAfterCreateError extends Error {
  public readonly errorCode = 'UM002';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = 'user_mission 생성 직후 조회에 실패했습니다.',
    data?: unknown,
    statusCode = 500
  ) {
    super(reason);
    this.name = 'UserMissionNotFoundAfterCreateError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

// "내 미션 목록" 조회 시 유저 없음
export class NoCurrentUserForMyMissionsError extends Error {
  public readonly errorCode = 'UM003';
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    reason: string = '사용자가 없습니다. 먼저 회원가입을 해주세요.',
    data?: unknown,
    statusCode = 401
  ) {
    super(reason);
    this.name = 'NoCurrentUserForMyMissionsError';
    this.data = data ?? null;
    this.statusCode = statusCode;
  }
}

