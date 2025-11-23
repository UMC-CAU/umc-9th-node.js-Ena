import 'dotenv/config';
import express, { Request, Response, NextFunction } from "express";
import cors from 'cors';
import dotenv from "dotenv";
import morgan from "morgan";          
import cookieParser from "cookie-parser";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { handleUserSignUp } from './controllers/user.controller.js';
import { handleAddStore, handleListStoreReviews } from './controllers/store.controller.js';
import { handleAddReviewToStore } from './controllers/review.controller.js';
import { handleAddMission, handleGetStoreMissions } from './controllers/mission.controller.js';
import { handleStartMission, handleListMyMissions  } from './controllers/user-mission.controller.js';

// Extend Express Response type to include success and error helpers
declare global {
  namespace Express {
    interface Response {
      success: (success: any) => Response;
      error: (params: { errorCode?: string; reason?: any; data?: any }) => Response;
    }
  }
}

const app = express();

// env 안전 처리
const port = Number(process.env.PORT ?? 3000);
if (Number.isNaN(port)) throw new Error('PORT must be a number');

/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

/**
 * 공통 미들웨어
 */
app.use(morgan('dev'));          // ✅ 요청/응답 로그
app.use(cookieParser());         // ✅ 쿠키 파싱
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

/**
 * 라우터
 */
app.post('/api/v1/users/signup', handleUserSignUp);
app.post('/api/v1/stores', handleAddStore);
app.post('/api/v1/stores/:storeId/reviews', handleAddReviewToStore);
app.get('/api/v1/stores/:storeId/reviews', handleListStoreReviews);
app.post('/api/v1/missions', handleAddMission);
app.get('/api/v1/stores/:storeId/missions', handleGetStoreMissions);
app.post('/api/v1/missions/:missionId/challenge', handleStartMission);
app.get('/api/v1/missions/my', handleListMyMissions);

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.ts"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

// ...