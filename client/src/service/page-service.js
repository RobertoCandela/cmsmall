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
