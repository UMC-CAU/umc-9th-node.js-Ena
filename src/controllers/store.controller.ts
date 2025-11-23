import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { bodyToStore } from '../dtos/store.dto.js';
import { addStoreService, listStoreReviews } from '../services/store.service.js';
import { InvalidStoreIdError } from '../error.js';

export const handleAddStore = async (req: Request, res: Response, next: NextFunction) => {
  /*
    #swagger.summary = '상점 등록 API'
    #swagger.description = '새로운 상점을 등록하는 API입니다.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "상점 이름"
              },
              address: {
                type: "string",
                description: "상점 기본 주소"
              },
              detailAddress: {
                type: "string",
                description: "상세 주소"
              },
              categoryId: {
                type: "number",
                description: "상점 카테고리 ID"
              },
              regionId: {
                type: "number",
                description: "지역 ID"
              }
            },
            required: ["name", "address", "categoryId", "regionId"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "상점 등록 성공 응답",
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
                description: "생성된 상점 정보",
                properties: {
                  id: {
                    type: "number",
                    example: 1
                  },
                  name: {
                    type: "string",
                    example: "UMC 카페"
                  },
                  address: {
                    type: "string",
                    example: "서울특별시 어딘가 123"
                  },
                  detailAddress: {
                    type: "string",
                    example: "3층 301호"
                  },
                  categoryId: {
                    type: "number",
                    example: 1
                  },
                  regionId: {
                    type: "number",
                    example: 10
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
              resultType: {
                type: "string",
                example: "FAIL"
              },
              error: {
                type: "object",
                properties: {
                  errorCode: {
                    type: "string",
                    example: "S001"
                  },
                  reason: {
                    type: "string",
                    example: "name은(는) 필수 값입니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: {
                      field: "name"
                    }
                  }
                }
              },
              success: {
                type: "object",
                nullable: true,
                example: null
              }
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
              resultType: {
                type: "string",
                example: "FAIL"
              },
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
              success: {
                type: "object",
                nullable: true,
                example: null
              }
            }
          }
        }
      }
    }
  */
  try {
    const dto = bodyToStore(req.body);
    // 이번 주차 가정: “특정 사용자(예: 첫 번째 사용자)”로 처리해야 한다면
    // 필요 시 userId를 하드코딩/조회해서 store 생성자 기록 등을 남길 수 있음.
    const created = await addStoreService(dto);
    return res.status(StatusCodes.CREATED).success(created);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/stores/:storeId/reviews?cursor=10&size=5
export const handleListStoreReviews = async (req: Request, res: Response, next: NextFunction) => {
  /*
    #swagger.summary = '상점 리뷰 목록 조회 API';
    #swagger.responses[200] = {
      description: "상점 리뷰 목록 조회 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                        user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                        content: { type: "string" }
                      }
                    }
                  },
                  pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
                }
              }
            }
          }
        }
      }
    };
  */
  try {
    const storeId = Number(req.params.storeId);
    if (Number.isNaN(storeId)) {
      // ✅ 잘못된 storeId도 커스텀 에러로
      throw new InvalidStoreIdError('유효하지 않은 storeId 입니다.', {
        raw: req.params.storeId,
      });
    }

    const cursor =
      req.query.cursor !== undefined ? Number(req.query.cursor) : null;
    const size =
      req.query.size !== undefined
        ? Math.min(Number(req.query.size), 50)
        : 5; // 상한 50

    const mine = String(req.query.mine ?? '') === '1';
    const userId = mine; // TODO: 이후 실제 userId로 변경 예정

    const options: any = { cursor, size };
    if (mine) options.userId = userId;

    const out = await listStoreReviews(storeId, options);

    // ✅ 여기서도 통일된 응답 포맷
    return res.status(StatusCodes.OK).success(out);
  } catch (err) {
    next(err);
  }
};

