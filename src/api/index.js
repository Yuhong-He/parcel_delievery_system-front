import user from './modules/user'
import parcel from "@/api/modules/parcel";

const api = {
    ...user,
    ...parcel
}

export default api;
