import bcrypt from 'bcrypt';
import { responseFromUser } from '../dtos/response.dto.js';
import { bodyToUser } from '../dtos/user.dto.js';
import { addUser, getUser, getUserPreferencesByUserId, setPreference } from '../repositories/user.repository.js';
import { DuplicateUserEmailError, UserNotFoundAfterSignUpError } from "../error.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

export const userSignUp = async (raw: any) => {
  const data = bodyToUser(raw); // data.password 존재

  // 1) 평문 비번 → 해시
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  // 2) 유저 생성 (레포는 해시 문자열을 받도록)
  const userId = await addUser({
    email: data.email,
    password: passwordHash,   // ❗️여기서 passwordHash 사용
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (userId === null) throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);


  // 3) 선호 카테고리 매핑
  for (const pref of data.preferences) {
    await setPreference(userId, pref);
  }

  // 4) 응답 조립 (null 가드)
  const userRow = await getUser(userId);
  if (!userRow) throw new UserNotFoundAfterSignUpError("회원가입 직후 사용자 조회에 실패했습니다.",{ userId });

  const prefs = await getUserPreferencesByUserId(userId);
  return responseFromUser({
    user: { email: userRow.email, name: userRow.name },
    preferences: prefs.map(p => ({ name: p.name })),
  });
};
