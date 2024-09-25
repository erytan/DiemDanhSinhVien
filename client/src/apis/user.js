import axios from "../axios";
export const apiLogin = (data) => axios.post("user/login", data);
export const apiGetUSER = (data) =>
  axios({
    url: "user/current",
    method: "get",
    data,
  });
export const apiGetAllUSER = (data) =>
  axios({
    url: "user/",
    method: "get",
    data,
  });
  export const apiForgotPassword = (data) =>
    axios({
      url: "user/forgetpassword",
      method: "post",
      data,
    });
  export const apiResetPassword  = (data) =>
    axios({
      url: "user/resetpassword",
      method: "put",
      data,
    });