const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    //1. 요청에서 username,password꺼내기,
    const { username, password } = req.body;
    //2. 존재하는 유저인지 확인
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "이미존재하는 사용자입니다" });
    }
    //3. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);
    //4. db에 저장하기
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "회원가입이 완려됐다" });
  } catch (error) {
    res.status(500).json({ message: "서버오류가 발생했다" });
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "사용자를 찾을수없습니다" });
    }
    if (!user.isActive) {
      return res
        .status(401)
        .json({ message: "비활성화된 계정- 로그인이 불가능한 상태 " });
      //5번이상 틀리거나 계정 비활성화됐을떄
    }
    if (user.isLoggedIn) {
      //isLoggedIn이 참이면, 이미 누가 로그인 한 상태니까
      return res
        .status(401)
        .json({ message: "이미 다른기기에서 로그인되어 있습니다 " });
    }
    //클라이언트에게 받은 password == 실제 저장된 password 동일한지 확인
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      user.failedLoginAttempt += 1;
      user.lastLoginAttempt = new Date();

      if (user.failedLoginAttempt >= 5) {
        user.isActive = false;
        //계정이 비활성화된거를 db에 업데이트 해야되므로 user.save() 해야된다
        await user.save();
        //비활성된거를 클라이언트한테 알리기
        return res
          .status(401)
          .json({ message: "비밀번호를 5회이상틀려 비활성화됐습니다" });
      }
      await user.save();
      return res.status(401).json({
        message: "비밀번호가 일치하지 않습니다",
        remainingAttempts: 5 - user.failedLoginAttempt,
      });
    }
    //근데 정상적인 로그인이 됐을떄,  위에 로그인횟수, 시간은 초기화해야되므로, 아래처럼 업데이트
    user.failedLoginAttempt = 0;
    user.lastLoginAttempt = new Date();
    user.isLoggedIn = true;

    //ip-address 가져오기 ->axios로 불러오기
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      const ipAddress = response.data.ip;
      user.ipAddress = ipAddress;
    } catch (error) {
      console.log("IP 주소 가져오던 중 오류 발생", error.message);
    }
    //로그인 성공했을때, 초기화한 값들이 모두 실제 서버에 저장되도록
    await user.save();

    //jwt + 시크릿 키도 생성하기
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      //24시간뒤에 토큰이 만료되므로 다시 로그인해야된다
    );

    console.log(token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    //비번 일부로 뺴고 보내기?
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.log("서버 오류발생했습니다", error.message);
    return res.status(401);
  }
});

router.post("/logout", async (req, res) => {
  try {
    //client->server로 토큰 전달해줘야됨, 가져온 토큰 추출
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "이미 로그아웃된 상태입니다" });
    }
    //토큰 패키지를 불러와서 ,검증하는 단계(토큰값이랑, 셀제 jwt 인증하기)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (user) {
        user.isLoggedIn = false;
        await user.save();
      }
    } catch (error) {
      console.log("토큰검증 오류", error.message);
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: "production",
      sameSite: "strict",
    });
    res.json({ message: "로그아웃 되었습니다" });
  } catch (error) {
    console.log("로그아웃오류", error.message);
    res.status(500).json({ message: "서버 오류가 발생했습니다" });
  }
});

router.delete("/delete/:userId", async (req, res) => {
  try {
    //:userId는 client한테 받는건가?
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      //사용자를 찾을수없는경우, user가 비어있겠지
      return res.status(401).json({ message: "사용자를 찾을수 없습니다" });
    }
    res.json({ message: "사용자가 성공적으로 삭제되었습니다" });
  } catch (error) {
    res.status(500).json({ message: "서버 오류가 발생했습니다 " });
  }
});

//토큰 인증 관련 코드
router.post("/verify-token", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ isValid: false, message: "토큰이없습니다" });
  }
  //아래에서 토큰이 유효한지 확인하기
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ isValid: true, user: decoded });
  } catch (error) {
    return res
      .status(401)
      .json({ isValid: false, message: "유효하지 않은 토큰입니다 " });
  }
});
module.exports = router;

//클라이언트가 signup 요청을 하면,1)request보낸곳의 body에서 username, password를 뽑아온다,2. 근데 그 뽑아온 username이 이미 존재하는 거면 또 가입하면안되니꼐 if문으로 처리,
//  3. (새로운 username이라면), password를 hashed 보안용으로 처리한다 4. 만들어둔 User모델(스키마)를 사용해서 새로운 User객체를 만들어서 저장한다
