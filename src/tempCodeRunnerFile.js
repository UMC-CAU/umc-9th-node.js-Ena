// const express = require('express')  // -> CommonJS
import express from "express";          // -> ES Module
import dotenv from "dotenv";        // .env 파일ㄹ부터 환경 변수 읽고 process.env. 객체를 통해 접근 가능

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); //cors 방식 허용
app.use(express.static("public")); //정적 파일 제공
app.use(express.json()); //json 파싱
// request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})