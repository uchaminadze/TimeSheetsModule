import React, { useEffect, useState } from "react";
import Home from "./pages/Home/home";

function App() {
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    getUserInfo();  
    fetch(`/api/getroles`, {  
      method: "POST", 
      body: JSON.stringify({
        user: {
          accessToken: "eyJ1c2VySWQiOiJjMDNlYjZmZWJlM2VkMmYzYzNiZDFkMWFmNzQzMzhjNSIsInVzZXJSb2xlcyI6WyJhbm9ueW1vdXMiLCJhdXRoZW50aWNhdGVkIl0sImNsYWltcyI6W10sImlkZW50aXR5UHJvdmlkZXIiOiJhYWQiLCJ1c2VyRGV0YWlscyI6InVzZXJyciJ9"   
        }
      }),
      headers: {
        "Content-type": "application/json"
      },
      
      
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  }, []);

  async function getUserInfo() {
    const response = await fetch("/.auth/me");
    const user = await response.json();
    console.log(user);
    setUserInfo(user);
  }


  return (
    <>
      {userInfo?.clientPrincipal !== null && (
        <li>
          <a href="/.auth/logout">Log out</a>
        </li>
      )}
      {userInfo?.clientPrincipal === null && (
        <li>
          <a href="/authenticated/">Only authenticated users</a>
        </li>
      )}
      <Home user={userInfo} />
    </>
  );
}

export default App;
