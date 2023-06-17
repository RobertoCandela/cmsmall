const url = "http://localhost:3000"

export const getPages = async () => {
  try {
    const response = await fetch(url + "/pages");
    if (response.status === 200) {
      return response.json()
    }
  } catch (err) {
    console.log(err);
    throw(err)
  }
};

export const deletePage = async (pageId) =>{

  try {
    const response = await fetch(url + `/pages/${pageId}`,{ method: 'DELETE' });
    if (response.status === 204) {
      return response.status
    }
  } catch (err) {
    console.log(err);
    throw(err)
  }

};
