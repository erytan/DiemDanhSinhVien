import axios from "../axios";
export const apiGetSession = (data) =>
  axios({
    url: "session/",
    method: "get",
    data,
  });
export const apiGetOneSession = (ssid) => {
  return axios({
    url: `session/${ssid}`,
    method: "get",
  });
};
export const apiGetSessions = (data) => {
  return axios({
    url: `session/`,
    method: "get",
    data,
  });
};
export const apiCreateSession = (data) => {
  return axios({
    url: `session/`,
    method: "post",
    data,
  });
};
export const apiDeleteSession = async (sid, ssid) =>
  axios({
    url: `session/${sid}/${ssid}`,
    method: "delete",
  });
export const apiUpdateCountUser = async (sid, mssv, attendanceCount) => {
  try {
    const response = await axios.put(`session/${sid}`, {
      MSSV: mssv,
      attendanceCount,
    });
    console.log('API response data:', response); 
    return response.updateSession;
  } catch (error) {
    console.error("API update error:", error);
    throw error;
  }
};
export const apiUpdateUserSession = async () => {
  return axios({
    url: `session/`,
    method: "put",
  })
}