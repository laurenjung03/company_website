const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
//s3client,
// putobjectcommand= 실제 업로드될때 사용되는 함수(s3에 파일을 실제로 넣는 명령서)-"이 파일을 저 버킷안에 넣어줘!"
const multer = require("multer");
//multer: 파일업로드 처리해주는 택배 분류 직원(파일업로드를 처리해주는 택배 분류직원), 사용자가 웹에 파일올리면 서버가그냥 받을수없어 multer가 중간에서 "어디,"얼마나"를 정해준다
//사용자가 웹에서 파일을 올리면, 서버가 그냥 받을수없음, multer가 중간에서 "어디에 저장할지, 크기크면 거절할지" 등 처리
const { v4: uuidv4 } = require("uuid");
const router = require("express").Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, //아아디
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, //비번
  },
});
//s3 클라이언트: 내 서버와 aws s3사이 연결 담당
//s3에 파일 올리려면 aws와 통신해야되는데, 그 연결 담당하는 객체

const imageUpload = multer({
  storage: multer.memoryStorage(), //디스크 말고 메모리에 임시 보관
  limits: {
    fileSize: 5 * 1024 * 1024, //5메가 초과하면 거절
  },
});

const fileUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, //50메가 초과하면 거절
  },
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(400).json({ message: "인증되지 않은 요청입니다" });
  }
  next();
};
//이미지 업로드 엔드포인트
router.post(
  "/image",
  verifyToken,
  imageUpload.single("image"),
  async (req, res) => {
    try {
      //1. 파일 이름
      const file = req.file;
      const fileExtension = file.originalname.split(".").pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      //2. 올릴 내용
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `post-images/${fileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      //3. 실제 업로드
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      const imageUrl = `http://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/post-images/${fileName}`;
      res.json({ imageUrl });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "이미지 업로드중 에러가 발생" });
    }
  },
);

router.post(
  "/file",
  verifyToken,
  fileUpload.single("file"),
  async (req, res) => {
    try {
      //1. 파일이름: 원본이름 유지

      const file = req.file;
      const originalName = req.body.originalName; // → "%EA%B3%A0%EC%96%91%EC%9D%B4%EC%82%AC%EC%A7%84.pdf"
      const decodedFileName = decodeURIComponent(originalName); // → "고양이사진.pdf"

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `post-files/${decodedFileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(decodedFileName)}`,
      };
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);

      const fileUrl = `http://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/post-files/${decodedFileName}`;
      res.json({ fileUrl });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "파일 업로드중 에러가 발생" });
    }
  },
);
module.exports = router;
