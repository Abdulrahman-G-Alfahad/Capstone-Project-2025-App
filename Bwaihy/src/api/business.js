import instance from ".";

const getBusinessProfile = async (id) => {
  console.log(id);
  try {
    const res = await instance.get(`/business/profile/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export { getBusinessProfile };
