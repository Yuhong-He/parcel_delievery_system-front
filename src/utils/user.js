import store from "@/store";

export function setUserInfo(data) {
    store.commit('User/setAccessToken', data.access_token);
    store.commit('User/setExpiredTime', data.expired_time);
    store.commit('User/setUsername', data.username);
    store.commit('User/setUserType', data.type);
}

export function cleanUserInfo() {
    store.commit('User/setAccessToken', "");
    store.commit('User/setExpiredTime', "");
    store.commit('User/setUsername', "");
    store.commit('User/setUserType', 0);
}
