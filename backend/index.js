require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
//express 라이브러리를 불러와서, 내 서버 객체(app)을 만드는 과정이다, 요리전 주방세팅 느낌
const PORT = 3000;

const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");
const postRoutes = require("./routes/post");
const uploadRoutes = require("./routes/upload");

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],

    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/post", postRoutes);
app.use("/api/upload", uploadRoutes);

//엔드포인트 설정하기
app.get("/", (req, res) => {
  res.send("hello world");
});
//req:고객이 보낸 데이터, res: 내가 보낼 응답(결과물)
//서버 실행: 서버가 계속 리스닝을 할수있도록

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongoDB와 연결 성공! "))
  .catch((err) => console.log("mongoDB와 연결에 문제발생", err));

app.listen(PORT, () => {
  console.log("🚀 Server is Running");
});
