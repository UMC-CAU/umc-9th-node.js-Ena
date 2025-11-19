// src/types/api-response.ts
export type ResultType = 'SUCCESS' | 'FAIL';

export interface SuccessResponse<T> {
  resultType: 'SUCCESS';
  error: null;
  success: T;
}

export interface ErrorBody {
  errorCode: string;
  reason: string | null;
  data: unknown;
}

export interface ErrorResponse {
  resultType: 'FAIL';
  error: ErrorBody;
  success: null;
}

// 실제 반환 타입을 하나로 묶어 사용
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
