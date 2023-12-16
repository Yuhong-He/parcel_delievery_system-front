import axios from "axios";
import {Loading, Message} from "element-ui";
import Vue from "vue";
import router from "@/router";
import store from "@/store";
import {cleanUserInfo} from "@/utils/user";

const Base_URL = 'http://localhost:18080'; // dev, front: dev.ucdparcel.ie
// const Base_URL = 'https://api.ucdparcel.ie'; // prod, front: www.ucdparcel.ie

const service = axios.create({
    timeout: 5000,
    responseType: "json",
    baseURL: Base_URL,
    headers: {
        "Content-Type": "application/json;charset=utf-8"
    }
})

service.interceptors.request.use(
    config => {
        config.headers['AccessToken'] = store.state.User.accessToken;
        return config
    },
    error => {
        Message({
            showClose: true,
            message: error,
            type: "warning"
        });
        return Promise.reject(error);
    });

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if(response.data.code === 201) { // custom response code
                Message.error("Server Error");
                return Promise.reject(response);
            } else if(response.data.code === 203) {
                Message.error("You Don't Have Permission!");
                toLoginPage();
                return Promise.resolve(response);
            } else if(response.data.code === 205) {
                Message.error("User not exist, please login again");
                toLoginPage();
                return Promise.resolve(response);
            } else if(response.data.code === 223) {
                Message.error("Token expired, please login again");
                toLoginPage();
                return Promise.resolve(response);
            } else if(response.data.code === 224) {
                Message.error("Token error, please login again");
                toLoginPage();
                return Promise.resolve(response);
            } else if(response.data.code === 225) {
                Message.error("Token not exist, please login again");
                toLoginPage();
                return Promise.resolve(response);
            } else {
                return Promise.resolve(response);
            }
        } else {
            Vue.prototype.$alert("Unexpected Error", {
                confirmButtonText: "Confirm",
                callback: () => {}
            }).then(() => {});
            return Promise.reject(response);
        }
    },
    error => {
        if(error.code === 'ECONNABORTED' || error.message === 'Network Error' || error.message.includes("timeout")) {
            Vue.prototype.$alert("Timeout, maybe internet problem or server inner problem", {
                confirmButtonText: "Confirm",
                callback: () => {}
            }).then(() => {});
        } else {
            Vue.prototype.$alert("Unexpected Error", {
                confirmButtonText: "Confirm",
                callback: () => {}
            }).then(() => {});
        }
        return Promise.reject(error.response);
    });

function toLoginPage() {
    cleanUserInfo();
    if(router.currentRoute.path !== '/login') {
        router.push('/login').then(() => {});
    }
}

export default service;
