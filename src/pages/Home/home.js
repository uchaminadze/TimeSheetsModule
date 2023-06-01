import React from 'react';

function Home({user}) {
  const {userDetails, userId, identityProvider} = user?.clientPrincipal || {};
  return(
    <>
      <h1>{userDetails}</h1>
      <h1>{userId}</h1>
      <h1>{identityProvider}</h1>
    </>
  );
}

export default Home;