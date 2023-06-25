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
