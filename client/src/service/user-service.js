const url = "http://localhost:3000/api";
function getJson(httpResponsePromise) {
  
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response) => {
          if (response.ok) {
            response
              .json()
              .then((json) => resolve(json))
              .catch((err) => reject({ error: "Cannot parse server response" }));
          } else {

            response
              .json()
              .then((obj) => reject(obj)) 
              .catch((err) => reject({ error: "Cannot parse server response" })); 
          }
        })
        .catch((err) => reject({ error: "Cannot communicate" })); 
    });
  }
export const getAllUsers = async () => {
    return getJson(fetch(url + "/users"));
  };