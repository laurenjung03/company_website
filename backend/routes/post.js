const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { marked } = require("marked");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, //아아디
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, //비번
  },
});

//미들웨어- ㄱ게시글 생성은 관리자만 가능
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

router.post("/", async (req, res) => {
  try {
    //title,content. fileurl필요
    const { title, content, fileUrl } = req.body;

    const latestPost = await Post.findOne().sort({ number: -1 });
    //가장 번호가 최신순으로 post정렬? 이거 왜하는거지 -> 해당 번호를 구해서 새로 생성하는 게시물 번호로 지정
    const nextNumber = latestPost ? latestPost.number + 1 : 1;

    /**const latestPost= await Post.findOne().sort({number:-1});
     * const nextNumber: latestPost? latestPost.number+1 : 1
     */

    const post = new Post({
      number: nextNumber,
      title,
      content,
      fileUrl,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "서버오류발생" });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "서버오류발생" });
  }
});

//특정게시물 가져오기
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "게시물을 찾을수없습니다" });
    }

    //**ip관련 조회수 기능
    let ip;
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      ip = response.data.ip;
    } catch (error) {
      console.log("IP 주소 가져오던 중 오류 발생", error.message);
      ip = req.ip;
    }
    const userAgent = req.headers["user-agent"];
    //헤더의 브라우저 정보

    //1일이 지나면, 조회수 오를수있도록
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hasRecentView = post.viewLogs.some(
      (log) =>
        log.ip === ip &&
        log.userAgent === userAgent &&
        new Date(log.timestamp) > oneDayAgo,
    );
    if (!hasRecentView) {
      post.views += 1;
      post.viewLogs.push({
        ip,
        userAgent,
        timestamp: new Date(),
      });
      await post.save();
    }

    let htmlContent;
    try {
      htmlContent = marked.parse(post.content || "");
    } catch (error) {
      console.log("마크다운 변환 실패:", error);
      htmlContent = post.content;
    }
    //응답 데이터 조합:html콘텐트가 post내용에 포함되어야하기떄문에
    const responseData = {
      ...post.toObject(), //post의 모든 필드 title,content,fileUrl등
      renderedContent: htmlContent, //변환된 html를 추가로 담음
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: "서버오류발생" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, content, fileUrl } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "게시글을찾을수없음" });
    }
    //**게시물 이미지 삭제되거나, 추가될경우 수정필요-s3에서 지우거나 수정해야된다  */

    const imgRegex =
      /https:\/\/[^"']*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)/g;
    const oldContentImages = post.content.match(imgRegex) || [];
    const newContentImages = content.match(imgRegex) || [];

    const deletedImages = oldContentImages.filter(
      (url) => !newContentImages.includes(url),
    );
    const deletedFiles = (post.fileUrl || []).filter(
      (url) => !(fileUrl || []).includes(url),
    );

    //업로드 진행
    const getS3KeyFromUrl = (url) => {
      try {
        const urlObj = new URL(url);
        return decodeURIComponent(urlObj.pathname.substring(1));
      } catch (error) {
        console.log("url파싱에러:", error);
        return null;
      }

      /**
       * const getS3KeyFromUrl =(url)=>{
       *const urlObj = new URL(url);
       return decodeURIComponent(urlObj.pathname.subString())
       * }
       */
    };

    const allDeletedFiles = [...deletedFiles, ...deletedImages];

    /**
     * const allDeletedFileds=[];
     * for(const fileUrl of allDeletedFiles){
     *  const key = getS3KeyFromUrl(fileUrl)
     * if(key){
     *  await s3client.send(new DeleteObejctCommand({Bucket, key, }))
     * }
     * }
     */

    for (const fileUrl of allDeletedFiles) {
      const key = getS3KeyFromUrl(fileUrl);
      if (key) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            }),
          );
          console.log("파일 삭제 완료: ", key);
        } catch (error) {
          console.log("파일 삭제 실패: ", error);
        }
      }
    }

    post.title = title;
    post.content = content;
    post.fileUrl = fileUrl;
    post.updatedAt = Date.now();

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "서버오류발생" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "게시글을찾을수없음" });
    }

    //내용과 이미지가 섞이니까, 정규식 써서 이미지 경로 작성하기
    const imgRegex =
      /https:\/\/[^"']*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)/g;
    const contentImages = post.content.match(imgRegex) || [];

    const getS3KeyFromUrl = (url) => {
      try {
        const urlObj = new URL(url);
        return decodeURIComponent(urlObj.pathname.substring(1));
      } catch (error) {
        console.log("url파싱에러:", error);
        return null;
      }
    };
    const allFiles = [...contentImages, ...(post.fileUrl || [])];
    for (const fileUrl of allFiles) {
      const key = getS3KeyFromUrl(fileUrl);
      if (key) {
        console.log("파일 삭제 완료: ", key);
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            }),
          );
        } catch (error) {
          console.log("파일 삭제 실패: ", error);
        }
      }
    }

    await post.deleteOne();
    res.json({ message: "게시글이 성공적으로 삭제되었습니다" });
  } catch (error) {
    res.status(500).json({ message: "서버오류발생" });
  }
});

module.exports = router;
