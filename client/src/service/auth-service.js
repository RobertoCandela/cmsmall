const url = "http://localhost:3000/api";

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          response.json()
            .then(obj => 
              reject(obj)
              ) 
            .catch(err => reject({ error: "Cannot parse server response" })) 
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      )
  });
}
export const login = async (user) => {
  return getJson(fetch(url + '/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(user),
  })
  )
};

export const getCurrentSession = async () => {

    return getJson(fetch(url + "/sessions/current", {
      credentials: "include",
    }));
    
};

export const signup = async (user) => {
    return getJson(fetch(url + "/signup", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:'include',
      body: JSON.stringify(user),
    }));
  
};

export const logout = async () => {
  return getJson(fetch(url + "/sessions/current", {
    method: "DELETE",
    credentials: "include", // this parameter specifies that authentication cookie must be forwared
  }));
};
