import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/material/styles";

import {
  Box,
  Container,
  IconButton,
  Paper,
  Typography,
  Divider,
  Chip,
  Skeleton,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShareIcon from "@mui/icons-material/Share";
import VisabilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { format } from "date-fns";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));
const PostHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  gap: theme.spacing(2),
}));

function SinglePost() {
  const { id } = useParams(); //id 값을가져온다

  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false); //공유 버튼 url 관련

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postResponse = await axios.get(`/api/post/${id}`);
        setPost(postResponse.data);
      } catch (error) {
        console.log("게시글 로딩 실패", error);
      } finally {
        setLoading(false);
        //잘 끝내면(post잘 불러왔으면), 로딩 닫기
      }
    };

    fetchPost();
  }, [id]); //id값이 바뀌었을떄 실행

  const handleShare = () => {
    //복사하는 기능

    navigator.clipboard.writeText(window.location.href);
    setOpenSnackbar(true);
    //클립보드에 추가해서 복사할수있도록 , navigator는 내장 기능?
  };

  const handleFileDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  /**임시로 */
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 14 }}>
        <StyledPaper elevation={2}>
          <Skeleton variant="text" height={60} />
          <Skeleton variant="text" width="60%" />
          <Divider sx={{ my: 3 }} />
          <Skeleton variant="rectangular" height={200} />
        </StyledPaper>
      </Container>
    );
  }
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;
  return (
    <Container maxWidth="lg" sx={{ py: 14 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} arial-label="뒤로가기">
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handleShare} arial-label="뒤로가기">
          <ShareIcon />
        </IconButton>
      </Box>

      <StyledPaper elevation={2}>
        <PostHeader>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                No. {post.number}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <VisabilityIcon
                  sx={{ fontSize: 18, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {post.views}
                </Typography>
              </Box>
            </Box>
            <Typography variant="h5" component="h1" gutterBottom>
              {post.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, color: "text.secondary" }}>
              <Typography variant="body2">
                {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm:ss")}
              </Typography>
            </Box>
          </Box>
        </PostHeader>

        <Divider sx={{ my: 3 }} />
        <Box sx={{ my: 4 }}>
          <div
            dangerouslySetInnerHTML={{ __html: post.renderedContent }}
            style={{ lineHeight: 1.8, fontSize: "1.2rem" }}
          />
          {/* //renederedcontent는 예전에 post.js에서 html변환한거? */}
        </Box>
        {post.fileUrl && post.fileUrl.length > 0 && (
          <Box sx={{ mt: 4, p: 2, bgcolor: "gray.50", borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              첨부파일
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {post.fileUrl.map((file, index) => (
                <Chip
                  key={index}
                  label={file.split("/").pop()}
                  variant="outlined"
                  clickable
                  icon={<FileDownloadIcon />}
                  sx={{
                    "&hover": { bgcolor: "grey.200" },
                    "& .MultiChip-icon": { fontSize: 20 },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </StyledPaper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        message="URL이 클릭보드에 복사됐습니다"
      />
    </Container>
  );
}

export default SinglePost;
