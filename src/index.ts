import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { handleUserSignUp } from './controllers/user.controller.js';
import { handleAddStore, handleListStoreReviews } from './controllers/store.controller.js';
import { handleAddReviewToStore } from './controllers/review.controller.js';
import { handleAddMission, handleGetStoreMissions } from './controllers/mission.controller.js';
import { handleStartMission, handleListMyMissions  } from './controllers/user-mission.controller.js';

const app = express();

// env 안전 처리
const port = Number(process.env.PORT ?? 3000);
if (Number.isNaN(port)) throw new Error('PORT must be a number');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.post('/api/v1/users/signup', handleUserSignUp);
app.post('/api/v1/stores', handleAddStore);
app.post('/api/v1/stores/:storeId/reviews', handleAddReviewToStore);
app.get('/api/v1/stores/:storeId/reviews', handleListStoreReviews);
app.post('/api/v1/missions', handleAddMission);
app.get('/api/v1/stores/:storeId/missions', handleGetStoreMissions);
app.post('/api/v1/missions/:missionId/challenge', handleStartMission);
app.get('/api/v1/missions/my', handleListMyMissions);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
