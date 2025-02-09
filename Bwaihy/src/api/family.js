import instance from ".";

const addFamily = async (id, familyInfo) => {
  try {
    const res = await instance.post(
      `/personal/addFamilyMember/${id}`,
      familyInfo
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getFamily = async (id) => {
  try {
    const res = await instance.get(`/personal/getFamilyMembers/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const deleteFamily = async (userId, familyId) => {
  console.log(userId, familyId);
  try {
    const res = await instance.delete(
      `/personal/removeFamilyMember/${userId}/${familyId}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

const setLimit = async (userId, limit, memberId) => {
  //   console.log(userId, limit, memberId);
  try {
    const res = await instance.put(
      `/personal/setLimit/${userId}/${memberId}/${limit}`,
      limit
    );
    // console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export { addFamily, getFamily, deleteFamily, setLimit };
