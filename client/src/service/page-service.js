const url = "http://localhost:3000";
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyzing the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}
export const getPages = async () => {
  return getJson(fetch(url + "/pages",{
    credentials:'include'
  }));
};
export const getPage = async (page_id) => {
  return getJson(fetch(url + `/pages/${page_id}`));
};
export const deletePage = async (pageId) => {
  try {
    const response = await fetch(url + `/pages/${pageId}`, {
      method: "DELETE",
    });
    if (response.status === 204) {
      return response.status;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createPage = async (page) => {
  return getJson(
    fetch(url + "/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    })
  );
};

export const updatePage = async (page) => {
  page.blocks.forEach((block, index) => {
    block.item_order = index;
  });
  return getJson(
    fetch(url + `/pages/${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    })
  );
};

export const deleteComponent = async (id) => {
  return getJson(
    fetch(url + `/blocks/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
  );
};
export const createBlock = async (block) => {
  return getJson(
    fetch(url + "/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(block),
    })
  );
};
