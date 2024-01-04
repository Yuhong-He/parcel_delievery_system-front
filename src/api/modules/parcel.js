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
    listParcel(page) {
        return request({
            url: path + "/list",
            method: "get",
            params: {
                page: page
            }
        })
    },
    deliverParcel(parcelId) {
        return request({
            url: path + "/deliver",
            method: "post",
            params: {
                parcelId: parcelId
            }
        })
    },
    confirmAddress(parcelId) {
        return request({
            url: path + "/confirmAddress",
            method: "post",
            params: {
                parcelId: parcelId
            }
        })
    },
    confirmCollected(parcelId) {
        return request({
            url: path + "/confirmCollected",
            method: "post",
            params: {
                parcelId: parcelId
            }
        })
    },
    getParcelTracks(parcelId) {
        return request({
            url: path + "/tracks",
            method: "get",
            params: {
                parcelId: parcelId
            }
        })
    }
}
