import axios from "../axios";
export const apiLogin = (data) => axios.post('user/login', data);
export const apiGetUSER = (data) => axios({
    url: 'user/current',
    method: 'get',
    data
})
export const apiGetAllUSER = (data) => axios({
    url: 'user/',
    method: 'get',
    data
})