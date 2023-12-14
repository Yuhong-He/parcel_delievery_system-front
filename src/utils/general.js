import {Message} from "element-ui";
import router from "@/router";

export function generalError(data) { // error with request.js Promise.resolve

    const authenticationError = [
        203, 205, 223, 224, 225
    ]
    if (authenticationError.includes(data.code)) {
        console.log("Authentication Error");
    } else {
        Message.error("Unexpected Error");
        console.log(data.data);
    }
}

export function unexpectedError(res) { // error with request.js Promise.reject
    if(router.currentRoute.path !== '/') {
        router.push("/").then(() => {});
    }
    console.log(res);
}
