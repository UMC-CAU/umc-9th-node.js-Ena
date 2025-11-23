import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { startMissionService, listMyMissions } from '../services/user-mission.service.js';
import { getFirstUserId } from '../repositories/user-mission.repository.js';
import { NoCurrentUserForMyMissionsError } from '../error.js';

export const handleStartMission = async (req: Request, res: Response, next: NextFunction) => {
  /*
    #swagger.summary = '미션 도전 시작 API'
    #swagger.description = '사용자가 특정 미션에 도전(시작)할 때 사용하는 API입니다. 이미 도전 중인 미션이거나, 존재하지 않는 미션인 경우 실패 응답을 반환합니다.'

    #swagger.parameters['missionId'] = {
      in: 'path',
      required: true,
      description: '도전할 미션 ID',
      schema: { type: 'number' }
    }

    // ※ 현재 구현에서는 body가 없다고 가정 (로그인 사용자 기준으로 시작)
    // body가 있다면 여기에 #swagger.requestBody 추가

    #swagger.responses[201] = {
      description: "미션 도전 시작 성공 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                description: "시작된 유저-미션 정보",
                properties: {
                  userMissionId: {
                    type: "number",
                    example: 42
                  },
                  missionId: {
                    type: "number",
                    example: 3
                  },
                  userId: {
                    type: "number",
                    example: 1
                  },
                  status: {
                    type: "string",
                    example: "IN_PROGRESS",
                    description: "미션 상태 (예: IN_PROGRESS / COMPLETED 등)"
                  },
                  startedAt: {
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
      description: "요청 값 오류 (잘못된 missionId 형식 등)",
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
                    example: "missionId가 올바르지 않습니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: { missionId: "abc" }
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
      description: "해당 ID의 미션이 존재하지 않는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M404" },
                  reason: {
                    type: "string",
                    example: "해당 ID의 미션을 찾을 수 없습니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: { missionId: 9999 }
                  }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    }

    #swagger.responses[409] = {
      description: "이미 도전 중인 미션일 때(중복 도전 불가 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M409" },
                  reason: {
                    type: "string",
                    example: "이미 해당 미션에 도전 중입니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: {
                      missionId: 3,
                      currentStatus: "IN_PROGRESS"
                    }
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
    const result = await startMissionService(req.params.missionId);

    // ✅ 공통 성공 응답 포맷
    return res.status(StatusCodes.CREATED).success(result);
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/missions/my?status=in_progress&cursor=10&size=5
export const handleListMyMissions = async (req: Request, res: Response, next: NextFunction) => {
  /*
    #swagger.summary = '내 미션 목록 조회 API'
    #swagger.description = '현재 사용자(예: 첫 번째 사용자)를 기준으로 진행 중/완료된 미션 목록을 조회하는 API입니다. status, cursor, size 기반 페이지네이션을 지원합니다.'

    #swagger.parameters['status'] = {
      in: 'query',
      required: false,
      description: '조회할 미션 상태 (ongoing: 진행 중, completed: 완료). 기본값은 ongoing입니다.',
      schema: {
        type: 'string',
        enum: ['ongoing', 'completed']
      }
    }

    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '다음 페이지 조회를 위한 커서 값(마지막 userMissionId 등)',
      schema: {
        type: 'number',
        nullable: true
      }
    }

    #swagger.parameters['size'] = {
      in: 'query',
      required: false,
      description: '한 번에 조회할 미션 개수 (최대 50개, 기본값 5)',
      schema: {
        type: 'number'
      }
    }

    #swagger.responses[200] = {
      description: "내 미션 목록 조회 성공 응답",
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
                    description: "사용자의 미션 목록",
                    items: {
                      type: "object",
                      properties: {
                        userMissionId: { type: "number", example: 42 },
                        missionId: { type: "number", example: 3 },
                        storeId: { type: "number", example: 1 },
                        status: {
                          type: "string",
                          example: "ongoing",
                          description: "ongoing(진행 중) 또는 completed(완료)"
                        },
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
                        startedAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          example: "2024-09-14T12:34:56.000Z"
                        },
                        completedAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                          example: null
                        },
                        storeName: {
                          type: "string",
                          example: "UMC 치킨집"
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
                        example: 50,
                        description: "다음 페이지 조회에 사용할 커서 (더 이상 없으면 null)"
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
      description: "요청 값 오류 (잘못된 status/cursor/size 형식 등)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "MY400" },
                  reason: {
                    type: "string",
                    example: "status는 ongoing 또는 completed 이어야 합니다."
                  },
                  data: {
                    type: "object",
                    nullable: true,
                    example: { status: "invalid_status" }
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
      description: "현재 사용자에 대한 정보가 없거나, 사용자 미션이 존재하지 않는 경우",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U404" },
                  reason: {
                    type: "string",
                    example: "사용자가 없습니다. 먼저 회원가입을 해주세요."
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
    // 이번 주차: 세션/토큰이 없으므로 “첫 번째 사용자”를 가정
    const userId = await getFirstUserId(); // repositories/common.helper.ts 등
    if (!userId) {
      throw new NoCurrentUserForMyMissionsError(
        '사용자가 없습니다. 먼저 회원가입을 해주세요.',
      );
    }

    // status 기본값: in_progress
    const statusQ = String(req.query.status ?? 'ongoing');
    const status: 'ongoing' | 'completed' = statusQ === 'completed' ? 'completed' : 'ongoing';

    const cursor =
      typeof req.query.cursor === 'string' && /^\d+$/.test(req.query.cursor)
        ? parseInt(req.query.cursor, 10)
        : null;

    const size =
      typeof req.query.size === 'string' && /^\d+$/.test(req.query.size)
        ? Math.min(parseInt(req.query.size, 10), 50)
        : 5;

    const out = await listMyMissions(userId, { status, cursor, size });
    
    // ✅ 공통 성공 응답 포맷
    return res.status(StatusCodes.OK).success(out);
  } catch (e) {
    next(e);
  }
};
