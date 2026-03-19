import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { BrowserRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import About from "./components/pages/About/About";
import Leadership from "./components/pages/Leadership/Leadership";
import Services from "./components/pages/Services/Services";
import Contact from "./components/pages/Contact/Contact";
import MainPage from "./components/pages/MainPage/MainPage";
import Board from "./components/pages/Board/Board";

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
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
