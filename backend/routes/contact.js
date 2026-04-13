const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다" });
  }
  //토큰 검증결과
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; //왜 이렇게 하는가?
    next();
  } catch (error) {
    return res.status(403).json({ message: "토큰 검증이 필요합니다 " });
  }
};
//저장하는건 일반 유저도 할수있기때문에 authenticate안넣음
router.post("/", async (req, res) => {
  try {
    //5개의 입력을 받기
    const { name, phone, email, message, status } = req.body;
    const contact = new Contact({ name, email, phone, message, status });
    await contact.save();
    res.status(201).json({ message: "문의가 성공적으로 등록되었습니다" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "서버오류" });
  }
});

//관리자만 볼수있어야되므로 authenticateToken미들웨어 사용
router.get("/", authenticateToken, async (req, res) => {
  try {
    //전체 목록 갖고오기
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "서버에러가 발생했습니다" });
  }
});

//개별문의문에 대해서
router.get("/:id", async (req, res) => {
  try {
    //전체 목록 갖고오기
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "문의를 찾을수없습니다" });
    }
    res.json(contact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "서버에러가 발생했습니다" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    //해당 문의글 찾기
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!contact) {
      res.status(404).json({ message: "문의를 찾을수없다" });
    }
    res.json({ message: "문의상태 수정이 성공했습니다", contact });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "서버에러가 발생했습니다" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    //id로 문의글 찾은후 삭제
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      res.status(404).json({ message: "문의를 찾을수없다" });
    }
    res.json({ message: "문의가 성공적을 삭제됐습니다" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "서버에러가 발생했습니다" });
  }
});
//문의글 볼수있는건 관리자만 -> 관리자 증명위해 토큰 검사
//미들웨어사용할때는 next함수를 한번더 실행해야된다?

module.exports = router;
