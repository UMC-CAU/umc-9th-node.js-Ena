import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { addMissionService, listStoreMissions } from '../services/mission.service.js';
import { InvalidMissionStoreIdError } from '../error.js';

export const handleAddMission = async (req: Request, res: Response, next: NextFunction) => {
  /*
    #swagger.summary = '미션 생성 API'
    #swagger.description = '특정 상점에 새로운 미션을 생성하는 API입니다.'

    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              storeId: {
                type: "number",
                description: "미션이 속할 상점 ID"
              },
              title: {
                type: "string",
                description: "미션 제목"
              },
              description: {
                type: "string",
                description: "미션 상세 설명"
              },
              points: {
                type: "number",
                description: "미션 달성 시 지급되는 포인트"
              },
              expiredAt: {
                type: "string",
                format: "date-time",
                description: "미션 종료 일시"
              }
            },
            required: ["storeId", "title", "points"]
          }
        }
      }
    }

    #swagger.responses[201] = {
      description: "미션 생성 성공 응답",
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
                  id: { type: "number", example: 10 },
                  storeId: { type: "number", example: 1 },
                  title: { type: "string", example: "리뷰 작성하면 100포인트 지급" },
                  description: { type: "string", example: "해당 상점에서 주문 후 리뷰를 작성하면 포인트 지급" },
                  points: { type: "number", example: 100 },
                  expiredAt: {
                    type: "string",
                    format: "date-time",
                    example: "2024-12-31T23:59:59.000Z"
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
      description: "요청 값 오류(필수 값 누락, 잘못된 데이터 형식 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M001" },
                  reason: { type: "string", example: "title은(는) 필수 값입니다." },
                  data: {
                    type: "object",
                    nullable: true,
                    example: { field: "title" }
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
      description: "상점(storeId)이 존재하지 않을 경우",
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
                  reason: { type: "string", example: "해당 ID의 상점을 찾을 수 없습니다." },
                  data: { type: "object", nullable: true, example: { storeId: 999 } }
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
                  errorCode: { type: "string", example: "internal_server_error" },
                  reason: { type: "string", example: "예상치 못한 오류가 발생했습니다." },
                  data: { type: "object", nullable: true, example: null }
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
    const result = await addMissionService(req.body);

    // ✅ 공통 성공 응답 포맷 사용
    return res.status(StatusCodes.CREATED).success(result);
  } catch (err) {
    next(err);
  }
};

export const handleGetStoreMissions = async (req: Request, res: Response, next: NextFunction) => {
  /*
    #swagger.summary = '상점별 미션 목록 조회 API'
    #swagger.description = '특정 상점에 등록된 미션 목록을 조회하는 API입니다. cursor/size 기반 페이지네이션을 지원합니다.'

    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '미션을 조회할 상점 ID',
      schema: { type: 'number' }
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '다음 페이지 조회를 위한 커서 값(마지막 미션 ID 등)',
      schema: { type: 'number', nullable: true}
    }

    #swagger.parameters['size'] = {
      in: 'query',
      required: false,
      description: '한 번에 조회할 미션 개수 (최대 50개)',
      schema: { type: 'number'}
    }

    #swagger.responses[200] = {
      description: "상점 미션 목록 조회 성공 응답",
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
                    description: "미션 목록",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 3 },
                        storeId: { type: "number", example: 1 },
                        title: {
                          type: "string",
                          example: "리뷰 작성하면 100포인트 지급"
                        },
                        description: {
                          type: "string",
                          example: "해당 상점에서 주문 후 리뷰를 작성하면 포인트를 드립니다."
                        },
                        points: {
                          type: "number",
                          example: 100
                        },
                        expiredAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          example: "2024-12-31T23:59:59.000Z"
                        },
                        createdAt: {
                          type: "string",
                          format: "date-time",
                          example: "2024-09-14T12:34:56.000Z"
                        },
                        isActive: {
                          type: "boolean",
                          example: true
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    description: "페이지네이션 정보",
                    properties: {
                      cursor: {
                        type: "number",
                        nullable: true,
                        example: 20,
                        description: "다음 페이지 조회에 사용할 커서 (다음 페이지가 없으면 null)"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    #swagger.responses[400] = {
      description: "요청 값 오류 (잘못된 storeId 형식, 잘못된 cursor/size 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M400" },
                  reason: {
                    type: "string",
                    example: "storeId가 올바르지 않습니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: { raw: "abc" }
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
                  errorCode: { type: "string", example: "internal_server_error" },
                  reason: {
                    type: "string",
                    example: "예상치 못한 오류가 발생했습니다."
                  },
                  data: { type: "object", nullable: true, example: null }
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
    // 1) storeId 파싱
    const raw = String(req.params.storeId ?? '');
    const digits = raw.replace(/[^\d]/g, ''); // 비숫자 제거
    const storeId = digits ? parseInt(digits, 10) : NaN;

    if (!Number.isInteger(storeId)) {
      // ✅ 커스텀 Error 사용
      throw new InvalidMissionStoreIdError('storeId가 올바르지 않습니다.', {
        raw,
      });
    }
    const cursor =
      req.query.cursor !== undefined ? Number(req.query.cursor) : null;
    const size =
      req.query.size !== undefined
        ? Math.min(Number(req.query.size), 50)
        : 5;

    const out = await listStoreMissions(storeId, { cursor, size });

    // ✅ 성공 응답도 통일
    return res.status(StatusCodes.OK).success(out);
  } catch (e) {
    next(e);
  }
};