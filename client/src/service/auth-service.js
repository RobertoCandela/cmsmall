const url = "http://localhost:3000";

export const login = async (user) => {
  console.log("login attempt of user " + user);
  try {
    const response = await fetch(url + "/sessions", {
      method: "POST",
      credentials:'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    if (response.status === 200) {
      return response.json();
      
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getCurrentSession = async() =>{
    console.log("getting current session...");
    try {
      const response = await fetch(url + "/sessions/current",{
        credentials:'include'
      });
      if (response.status === 200) {
        return response.json();
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

export const logout = async() => {
    const response = await fetch(url + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'  // this parameter specifies that authentication cookie must be forwared
    })

    return response
  }