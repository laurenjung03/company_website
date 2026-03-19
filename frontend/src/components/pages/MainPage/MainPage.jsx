import React from "react";
import Contact from "./Contact";
import Forum from "./Forum";
import Hero from "./Hero";

function MainPage() {
  //Mainpage안에 Hero, contact,forum을 넣어서 쌓을거다
  return (
    <div>
      <Hero />
      <Forum />
      <Contact />
    </div>
  );
}

export default MainPage;
