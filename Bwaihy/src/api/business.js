import instance from ".";

const getBusinessProfile = async (id) => {
  // console.log("ID:     ", id);
  try {
    const res = await instance.get(`/business/profile/${id}`);
    // console.log("RESPONSE: ", res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export { getBusinessProfile };
