import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { bodyToUser } from '../dtos/user.dto.js';
import { userSignUp } from '../services/user.service.js';

export const handleUserSignUp = async (req: Request, res: Response, next: NextFunction) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
  try {
    const userDto = bodyToUser(req.body);
    const user = await userSignUp(userDto);
    res.status(StatusCodes.OK).json({ result: user });
  } catch (err) {
    next(err);
  }
};
