import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AdminNavbar from "./components/AdminNavbar/AdminNavbar";
import Footer from "./components/Footer/Footer";
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import About from "./components/pages/About/About";
import Leadership from "./components/pages/Leadership/Leadership";
import Services from "./components/pages/Services/Services";
import Contact from "./components/pages/Contact/Contact";
import MainPage from "./components/pages/MainPage/MainPage";
import Board from "./components/pages/Board/Board";
import axios from "axios";

import AdminLogin from "./components/pages/Admin/AdminLogin";
import AdminCreatePost from "./components/pages/Admin/AdminCreatePost";
import AdminEditPost from "./components/pages/Admin/AdminEditPost";
import AdminContacts from "./components/pages/Admin/AdminContacts";
import AdminPost from "./components/pages/Admin/AdminPost";
import SinglePost from "./components/pages/SinglePost/SinglePost";

function AuthRedirectRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      //백으로 보내서 토큰이 유효한가 확인하기
      try {
        const response = await axios.post(
          "/api/auth/verify-token",
          {},
          { withCredentials: true },
        );
        setIsAuthenticated(true);
      } catch (error) {
        console.log("토큰 인증 실패", error);
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }
  return isAuthenticated ? <Navigate to="/admin/posts" replace /> : <Outlet />;
}

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      //백으로 보내서 토큰이 유효한가 확인하기
      try {
        const response = await axios.post(
          "/api/auth/verify-token",
          {},
          { withCredentials: true },
        );
        setIsAuthenticated(response.data.isValid);
        setUser(response.data.user);
      } catch (error) {
        console.log("토큰 인증 실패", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }
  return isAuthenticated ? (
    <Outlet context={{ user }} />
  ) : (
    <Navigate to="/admin" replace />
  );
}

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* 여기에 페이지 내용들이 바뀌면서 들어옴(패티처럼) */}
      <Footer />
    </>
  );
};

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet />
    </>
  );
};

//const router=createRouterBrowser([{path:"/", element:<Layout/>, children:[index:true, element:<MainPage/>],[path:"/about", element:<About/>]}])

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/about", element: <About /> },
      { path: "/leadership", element: <Leadership /> },
      { path: "/board", element: <Board /> },
      { path: "/our-service", element: <Services /> },
      { path: "/contact", element: <Contact /> },
      { path: "/leadership", element: <Leadership /> },
      { path: "/post/:id", element: <SinglePost /> },
    ],
  },
  {
    path: "/admin",
    element: <AuthRedirectRoute />,
    children: [{ index: true, element: <AdminLogin /> }],
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,

    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "posts", element: <AdminPost /> },
          { path: "create-post", element: <AdminCreatePost /> },
          { path: "edit-post/:id", element: <AdminEditPost /> },
          { path: "contacts", element: <AdminContacts /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
