import { StatusCodes } from "http-status-codes"; //HTTP 응답 상태 코드 상수
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => { //next는 에러헨들러
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  const user = await userSignUp(bodyToUser(req.body));  // DTO 변환 후 서비스 레이어로 전달 //req 요청데이터
  res.status(StatusCodes.OK).json({ result: user });
};