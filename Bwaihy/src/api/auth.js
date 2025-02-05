import { saveToken } from "./storage";
import instance from ".";
import { jwtDecode } from "jwt-decode";

const login = async (userInfo) => {
    // const { accountType, setAccountType } = useContext(UserContext);
//   console.log(userInfo);
  try {
    const res = await instance.post("/auth/login", userInfo);
    const token = res.data.token;
    if (token) {
      saveToken(token);
    //   console.log(jwtDecode(token));
    }

    return res.data;
  } catch (error) {
    throw error;
  }
};

const register = async (userInfo) => {
    console.log(userInfo);
  try {
    const res = await instance.post("/auth/signup", userInfo);
    if (res.data) {
      saveToken(res.data.token);
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getProfile = async (id) => {
    // console.log(id);
    try {
        const res = await instance.get(`/personal/${id}`);
        // console.log(res)
        return res.data;
    } catch (error) {
        throw error;
    }
    }


export { login, register, getProfile };