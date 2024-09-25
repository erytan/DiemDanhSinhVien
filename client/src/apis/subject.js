import axios from "../axios";
export const apiCreateSubject = (data) =>
  axios({
    url: "subject/create",
    method: "post",
    data,
  });
export const apiGetSubject = (data) =>
  axios({
    url: "subject/",
    method: "get",
    data,
  });
export const apiGetOneSubject = (sid, data) => 
  axios({
    url: `subject/current/${sid}`,
    method: "get",
    data,
  });
export const apiUpdateSubject = (sid, data) =>
  axios({
    url: `subject/${sid}`,
    method: "put",
    data,
  });
export const apiGetSessionsBySubject = (tid) =>
  axios({
    url: `subject/err/${tid}`,
    method: "get",
  });
export const apiUpdateSubjectAndSession = (sid, ssid, data) =>
  axios({
    url: `subject/${sid}/${ssid}`,
    method: "put",
    data,
  });
export const apiDeleteSubject = async (sid) =>
  axios({
    url: `subject/` + sid,
    method: "delete",
  });
