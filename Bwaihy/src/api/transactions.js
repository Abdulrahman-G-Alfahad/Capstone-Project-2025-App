import instance from ".";
import transactionApi from "./transactionsApi";

const getTransactionsBySender = async (id) => {
  // console.log(id);
  try {
    const res = await transactionApi.get(`/transactions/sender/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getTransactionsByReceiver = async (id) => {
  try {
    const res = await transactionApi.get(`/transactions/receiver/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const makeDeposit = async (id, amount) => {
  console.log(id, amount);
  try {
    const res = await instance.post(`/personal/${id}/deposit`, amount);
    // console.log(res);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getAllUserTransactions = async (id) => {
  console.log(id);
  try {
    const res = await transactionApi.get(`/transactions/user/${id}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// const makeQRCodePayment = async (id, amount) => {

export {
  getTransactionsBySender,
  getTransactionsByReceiver,
  makeDeposit,
  getAllUserTransactions,
};
