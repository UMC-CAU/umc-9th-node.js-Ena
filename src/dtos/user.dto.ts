type Gender = '남성' | '여성';

export interface UserBody {
  email: string;              // 필수
  password: string;         // 선택
  name: string;               // 필수
  gender: Gender;             // 필수
  birth: string | Date;       // 'YYYY-MM-DD' 문자열 또는 Date
  address?: string;           // 선택
  detailAddress?: string;     // 선택
  phoneNumber: string;        // 필수
  preferences: number[];      // 필수
}

export interface UserDTO {
  email: string;
  password: string;
  name: string;
  gender: Gender;
  birth: Date;
  address: string;
  detailAddress: string;
  phoneNumber: string;
  preferences: number[];
}

export const bodyToUser = (body: UserBody): UserDTO => {
  const birth =
    body.birth instanceof Date ? body.birth : new Date(body.birth); // 날짜 변환

  return {
    email: body.email,
    password: body.password,
    name: body.name,
    gender: body.gender,
    birth,
    address: body.address ?? '',
    detailAddress: body.detailAddress ?? '',
    phoneNumber: body.phoneNumber,
    preferences: body.preferences,
  };
};
