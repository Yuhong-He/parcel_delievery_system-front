import request from "@/utils/request";

const path = "/parcel";

export default {
    createParcel(data) {
        return request({
            url: path + "/create",
            method: "post",
            data: data
        })
    },
    listParcel(data) {
        return request({
            url: path + "/list",
            method: "get",
            params: {
                page: data
            }
        })
    }
}
