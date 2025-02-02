import { createContext } from "react";

const AccountContext = createContext({
  accountType: "",
  setAccountType: () => {},
});

export default AccountContext;