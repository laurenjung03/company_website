const express = require("express");
const app = express();
//express 라이브러리를 불러와서, 내 서버 객체(app)을 만드는 과정이다, 요리전 주방세팅 느낌
const PORT = 3000;

//엔드포인트 설정하기
app.get("/", (req, res) => {
  res.send("hello world");
});
//req:고객이 보낸 데이터, res: 내가 보낼 응답(결과물)

//서버 실행: 서버가 계속 리스닝을 할수있도록
app.listen(PORT, () => {
  console.log("🚀 Server is Running");
});
