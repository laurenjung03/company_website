import React from "react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Board() {
  const navigate = useNavigate();
  //1.검색/필터링 관련
  const [posts, setPosts] = useState([]); //백엔드에서 받은 posts들(response데이터 저장)

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");

  //달력 날짜위한
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //post불러오는 useEffect
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post");
        setPosts(response.data);
      } catch (error) {
        console.log("게시글 가져오기 실패", error);
      }
    };
    //함수 끝난뒤에 fetchPosts를 자동으로 호출할수있도록
    fetchPosts();
  }, []);

  //함수들 복붙

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const value = post[searchType].toLowerCase() || "";
      const matchesSearch = value.includes(searchTerm.toLowerCase());

      const postDate = new Date(post.createdAt).getTime(); //이게뭐지
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;

      const matchesDate =
        (!start || postDate >= start) && (!end || postDate <= end);
      return matchesSearch && matchesDate;
    });
  }, [posts, searchTerm, searchType, startDate, endDate]);

  const totalPages =
    pageSize > 0 ? Math.ceil(filteredPosts.length / pageSize) : 1;

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  const dummyPosts = [];

  return (
    <div>
      <div className="p-4 mx-auto max-w-7xl py-32">
        <h1 className="text-4xl font-bold mt-6 mb-4 text-center">
          업무게시판{" "}
        </h1>

        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex w-full md:w-auto gap-2">
            <select
              className="border rounded px-2 py-2 text-base"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="title">제목</option>
            </select>
            <div className="flex-1 md:w-80">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                className="w-full border rounded px-3 py-2 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 달력 필터링하는 코드 만들기 */}

        <div className="flex  md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold">작성일 시작:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold">작성일 끝:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-auto"
            />
          </div>
        </div>

        <div className="mt-4 mb-4 flex justify-between items-center">
          <div className="text-lg font-bold text-gray-600">
            총 {paginatedPosts.length}개의 문의
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-base font-bold text-gray-600">
              페이지당 표시:
            </label>
            <select
              className="border rounded px-3 py-2"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {[10, 25, , 50, 100].map((size) => (
                <option key={size} value={size}>{`${size}개`}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium w-[8%]">
                  번호
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium w-auto">
                  제목
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium w-[20%]">
                  작성일
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium w-[8%]">
                  조회수
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    게시글이 없습니다
                  </td>
                </tr>
              ) : (
                paginatedPosts.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b text-sm"
                    onClick={() => navigate(`/post/${item._id}`)}
                  >
                    <td className="px-4 py-3">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 overflow-hidden overflow-ellipsis whitespace-nowrap  w-[15%]">
                      {new Date(item.createdAt).toLocaleDateString()};
                      {/* //이게뭔가 */}
                    </td>
                    <td className="px-4 py-3">{item.views}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* //모바일 부분 */}
        <div className="md:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedPosts.length === 0 ? (
            <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-lg shadow">
              게시글이 없습니다.
            </div>
          ) : (
            paginatedPosts.map((post, index) => (
              <Link to={`/post/${post._id}`} className="block">
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl 2xl:text-2xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {post.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      #{(currentPage - 1) * pageSize + index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    작성일: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    조회수 : {post.views}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="mt-4 flex justify-center space-x-2 text-lg font-bold">
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1 || totalPages === 0}
          >
            이전
          </button>
          <span className="px-3 py-1">
            {currentPage}/{totalPages}
          </span>
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

export default Board;
