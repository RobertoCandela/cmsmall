const url = "http://localhost:3000";

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}
export const login = async (user) => {
  return getJson(fetch(url + '/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    body: JSON.stringify(user),
  })
  )
};

export const getCurrentSession = async () => {
  console.log("getting current session...");
  try {
    const response = await fetch(url + "/sessions/current", {
      credentials: "include",
    });
    if (response.status === 200) {
      return response.json();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const signup = async (user) => {
  console.log("sign up user with object: ")
  console.log(user)
  
    return getJson(fetch(url + "/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    }));
  
};

export const logout = async () => {
  const response = await fetch(url + "/sessions/current", {
    method: "DELETE",
    credentials: "include", // this parameter specifies that authentication cookie must be forwared
  });

  return response;
};
