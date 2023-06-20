const url = "http://localhost:3000";

export const getPages = async () => {
  try {
    const response = await fetch(url + "/pages");
    if (response.status === 200) {
      return response.json();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getPage = async (page_id) => {
  try {
    const response = await fetch(url + `/pages/${page_id}`);
    if (response.status === 200) {
      return response.json();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
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
  console.log("actual page...");
  console.log(page);
  console.log("actual body...");
  console.log(JSON.stringify(page));
  try {
    const response = await fetch(url + "/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
    if (response.status === 201) {
      return response.json();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updatePage = async (page) => {
  console.log("updating page with id " + page.id);
  console.log(page);
  console.log("actual body...");
  console.log(JSON.stringify(page));

  page.blocks.forEach((block, index) => {
    block.item_order = index;
  });
  try {
    const response = await fetch(url + `/pages/${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
    if (response.status === 200) {
      return response.json();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteComponent = async(id) =>{

  try {
    const response = await fetch(url + `/blocks/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 204) {
      return response.json();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }

}
export const createBlock = async (block) => {
  console.log("Saving block..." + block.id);

  try {
    const response = await fetch(url + "/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(page),
    });
    if (response.status === 201) {
      return response.json();
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
