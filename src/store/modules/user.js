export default {
    namespaced: true,
    state: {
        username: '',
        userType: '',
        accessToken: '',
        refreshToken: '',
        expiredTime: ''
    },
    mutations: {
        setUsername(state, payload) {
            state.username = payload;
        },
        setUserType(state, payload) {
            state.userType = payload;
        },
        setAccessToken(state, payload) {
            state.accessToken = payload;
        },
        setExpiredTime(state, payload) {
            state.expiredTime = payload;
        }
    }
}
