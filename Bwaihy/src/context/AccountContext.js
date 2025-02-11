import { createContext } from "react";

const AccountContext = createContext({
  accountType: "",
  setAccountType: () => {},
  userId: "",
  setUserId: () => {},
});

export default AccountContext;