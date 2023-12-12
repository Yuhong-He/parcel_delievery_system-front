import request from "@/utils/request";
import store from "@/store";

const path = "/user";

export default {
    sendVerificationEmail(data) {
        return request({
            url: path + "/sendRegisterEmail",
            method: "post",
            params: data
        })
    },
    register(data) {
        return request({
            url: path + "/register",
            method: "post",
            data: data
        })
    },
    login(data) {
        return request({
            url: path + "/login",
            method: "post",
            data: data
        })
    }
}
