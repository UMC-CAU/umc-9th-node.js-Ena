import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addReviewToStoreService } from '../services/review.service.js';

export const handleAddReviewToStore = async (req: Request, res: Response, next: NextFunction) => {
  /*
    #swagger.summary = '상점 리뷰 작성 API'
    #swagger.description = '특정 상점에 대한 사용자의 리뷰를 등록하는 API입니다.'

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '리뷰를 등록할 상점의 ID',
      schema: { type: 'number', example: 1 }
    }

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              userId: {
                type: "number",
                description: "리뷰를 작성하는 사용자 ID"
              },
              score: {
                type: "number",
                description: "리뷰 평점 (예: 1~5점)"
              },
              content: {
                type: "string",
                description: "리뷰 내용"
              },
              visitedAt: {
                type: "string",
                format: "date-time",
                nullable: true,
                description: "방문/주문 일시 (선택)"
              }
            },
            required: ["userId", "score", "content"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "리뷰 작성 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: {
                type: "string",
                example: "SUCCESS"
              },
              error: {
                type: "object",
                nullable: true,
                example: null
              },
              success: {
                type: "object",
                description: "생성된 리뷰 정보",
                properties: {
                  id: {
                    type: "number",
                    example: 10
                  },
                  storeId: {
                    type: "number",
                    example: 1
                  },
                  userId: {
                    type: "number",
                    example: 1
                  },
                  score: {
                    type: "number",
                    example: 4.5
                  },
                  content: {
                    type: "string",
                    example: "음식이 맛있고 배달도 빨랐어요!"
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    example: "2024-09-14T12:34:56.000Z"
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "요청 값 검증 실패(필수 값 누락, 잘못된 형식 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "R001" },
                  reason: {
                    type: "string",
                    example: "score는 1 이상 5 이하의 숫자여야 합니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: { field: "score" }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[404] = {
      description: "상점이 존재하지 않는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S404" },
                  reason: {
                    type: "string",
                    example: "해당 ID의 상점을 찾을 수 없습니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: { storeId: 9999 }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[500] = {
      description: "서버 내부 오류",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    example: "internal_server_error"
                  },
                  reason: {
                    type: "string",
                    example: "예상치 못한 오류가 발생했습니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: null
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }
  */
  try {
    const result = await addReviewToStoreService(req.body, req.params.storeId);

    // ✅ 공통 성공 응답 포맷 사용
    return res.status(StatusCodes.CREATED).success(result);
  } catch (err) {
    next(err);
  }
};
