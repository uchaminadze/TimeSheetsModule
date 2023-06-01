import React, { useEffect, useState } from "react";
import Home from "./pages/Home/home";

function App() {
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    getUserInfo();
  }, []);

  async function getUserInfo() {
    const response = await fetch("/.auth/me");
    const user = await response.json();
    setUserInfo(user)
  }


  if(userInfo?.clientPrincipal === null) {
    window.location.replace("/.auth/login/aad")
  }

  
  return(
    <>
      <a href="/.auth/logout">Log out</a>
      <Home user={userInfo}/>
    </>
  );
}

export default App;
