import instance from ".";

const getTransactionsBySender = async (id) => {
  try {
    const res = await instance.get(`/transaction/sender/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getTransactionsByReceiver = async (id) => {
  try {
    const res = await instance.get(`/transaction/receiver/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const makeDeposit = async (id, amount) => {
  console.log(id, amount);
  try {
    const res = await instance.post(`/transaction/deposit/${id}`, amount);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export { getTransactionsBySender, getTransactionsByReceiver, makeDeposit };
