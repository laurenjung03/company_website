import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
function AdminEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    // fileUrl: [],-- 화면에 fileUrl 표시할 필요가 없기떄문ㅇ ㅔ필요없음
    fileList: [],
    files: [],
    existingFiles: [],
  });

  const editorRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState({}); //파일별 업로드 진행률
  const [currentUpload, setCurrentUpload] = useState(null); //현재 업로드중인 파일명 저장
  const [showUploadModal, setShowUploadModal] = useState(false); //업로드 모달 팝업창 여부

  //해당 formData 갖고오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/post/${id}`,
        );
        setFormData({
          title: response.data.title,
          content: response.data.content,
          files: [],
          fileList: [],
          existingFiles: response.data.fileUrl || [],
        });
      } catch (error) {
        console.log("ㄱ게시물 가져오던 중에러발생", error);
        navigate("/admin/posts");
      }
    };
    fetchPost();
  }, [id, navigate]);

  const UploadModal = ({ progress, fileName }) =>
    showUploadModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            파일 업로드 중...
          </h3>
          <p className="text-sm text-gray-600 mb-4">{fileName}</p>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              {progress.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const editorContent = editorRef.current.getContent(); //이게 무슨 역할이었지, useRef써서 editorRef는 tinyMce 관리하는거 아니었나 ,이게왜필요하냐
    setShowUploadModal(true);

    try {
      const imgRegex =
        /https:\/\/[^"']*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)/g;

      const currentImages = editorContent.match(imgRegex) || [];

      const uploadedFiles = await Promise.all(
        //promise 사용하는 이유- 사진이나 파일이 여러개일수있으니까
        formData.fileList.map(async (file) => {
          //근데 왜 formData.fileList 인지 이런게 이었나
          setCurrentUpload(file.name); //현재 업로드되는 파일이름
          const fileFormData = new FormData();
          const encodedFileName = encodeURIComponent(file.name);
          fileFormData.append("file", file.file);
          fileFormData.append("originalName", encodedFileName);
          //근데 왜 new FormData를 한건가, 우리가 저걸 정의한적이 있나. 그냥 상태 formData만 선언한거 아니엇다? 그리고 왜 append를 해야되는가

          const response = await axios.post(
            "http://localhost:3000/api/upload/file",
            fileFormData,
            {
              withCredentials: true,
              headers: {
                "Content-Type": "multipart/form-data",
                //그리고 설명에서, 바로 못올리고 우선 upload/file을 해야된다고 했는데, 그게 이게 파일.이미지여서 일단 s3에 저장해야돼서 그런건가
                //그리고, 이렇게 되면 있는 사진과 파일이 함께 업로드되는거야? 우린 업로드 file,image따로 만들었던것같은데 왜 이렇게 하는건지
              },
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total,
                );
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: percentCompleted,
                }));
              },
            },
          );
          return response.data.fileUrl;
        }),
      );
      //promise가 끝났을떄
      const postData = {
        title: formData.title,
        content: editorContent,
        fileUrl: [...formData.existingFiles, ...uploadedFiles],
        currentImages: currentImages,
      };
      await axios.put(`http://localhost:3000/api/post/${id}`, postData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setShowUploadModal(false); //업로드가 끝났으니까 이제 모달을 안보이게
      navigate("/admin/posts");
    } catch (error) {
      console.log("게시물 업로드중 에러발생", error);
      setShowUploadModal(false);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    //새로운 파일 리스트
    const newFileList = newFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file,
    }));
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
      fileList: [...prev.fileList, ...newFileList],
    }));
  };

  const handleFileDelete = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter(
        (_, index) => prev.fileList[index].id !== fileId,
      ),
      fileList: prev.fileList.filter((file) => file.id !== fileId),
    }));
  };

  //기존에 있던 파일 삭제
  const handleExistingFileDelete = (fileUrl) => {
    setFormData((prev) => ({
      ...prev,
      existingFiles: prev.existingFiles.filter((url) => url !== fileUrl),
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 bytes";
    const k = 1024;
    const size = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat(bytes / Math.pow(k, i).toFixed(2) + " " + size[i]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 ">
      <div className="bg-white rounded-lg shadow p-4 sm:p-8 ">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-gray-800">
          게시물 수정
        </h2>

        <form className="space-y-4 sm:space-y-8" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-lg sm:text-xl font-medium text-gray-700 mb-2"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 text-base sm:text-lg py-2"
              required
            ></input>
          </div>
          <div>
            <label
              htmlFor="content"
              className="block text-lg sm:text-xl font-medium text-gray-700 mb-2"
            >
              내용
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={formData.content}
              init={{
                height: 500,
                menubar: true,
                toolbar_mode: "scrolling",
                toolbar_sticky: true,
                toolbar_location: "top",
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                  "image",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic | alignleft aligncenter " +
                  "alignright | bullist numlist | " +
                  "image | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px } @media (max-width: 768px) { body { font-size: 16px; } }",
                images_upload_handler: async (blobInfo, progress) => {
                  try {
                    const formData = new FormData();
                    formData.append("image", blobInfo.blob());

                    const response = await axios.post(
                      "http://localhost:3000/api/upload/image",
                      formData,
                      {
                        withCredentials: true,
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      },
                    );

                    return response.data.imageUrl;
                  } catch (error) {
                    console.error("Image upload failed:", error);
                    throw error;
                  }
                },
                file_picker_types: "image",
                automatic_uploads: true,
                file_picker_callback: function (cb, value, meta) {
                  const input = document.createElement("input");
                  input.setAttribute("type", "file");
                  input.setAttribute("accept", "image/*");

                  input.onchange = function () {
                    const file = this.files[0];
                    const reader = new FileReader();
                    reader.onload = function () {
                      const id = "blobid" + new Date().getTime();
                      const blobCache =
                        editorRef.current.editorUpload.blobCache;
                      const base64 = reader.result.split(",")[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);
                      cb(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                },
              }}
            />
          </div>
          {/*           
            //기존에 있던 파일들 보여주는 곳 
            //지금 은 수정하는 페이지이므로,원래 있던 파일들 목록을 보여줘야 한다  */}
          {formData.existingFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">기존 첨부파일:</h3>
              <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                {formData.existingFiles.map((fileUrl, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center space-x-3">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {decodeURIComponent(fileUrl.split("/").pop())}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleExistingFileDelete(fileUrl)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label
              htmlFor="file"
              className="block text-lg sm:text-xl font-medium text-gray-700 mb-2"
            >
              새 첨부파일 추가
            </label>
            <input
              type="file"
              id="files"
              multiple
              className="mt-1 w-full text-base sm:text-lg text-gray-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-4 sm:file:px-6 file:rounded-lg file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              onChange={handleFileChange}
            />
            {formData.fileList.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium text-gray-700">
                  새호 추가된 파일 목록:
                </p>
                <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                  {formData.fileList.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div className="flex items-center space-x-3">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleFileDelete(file.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
            <button
              type="submit"
              className="w-full sm:w-auto sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium text-white bg-blue-600 border-2 border-transparent rounded-lg shadow-sm hover:bg-blue-700"
            >
              수정
            </button>
            <button
              type="button"
              className="w-full sm:w-auto sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              onClick={() => navigate("/admin/posts")}
            >
              {" "}
              취소
            </button>
          </div>
        </form>
      </div>
      {/* //업로드 됐을떄 보일 모달 창 */}
      <UploadModal
        progress={uploadProgress[currentUpload] || 0}
        fileName={currentUpload || ""}
      />
    </div>
  );
}

export default AdminEditPost;
