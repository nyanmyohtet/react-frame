import { LocalStorage } from "./LocalStorage/LocalStorage.service";

export default function authHeader() {
    const user = JSON.parse(LocalStorage.get("user"));

    if (user && user.accessToken) {
        return { Authorization: "Bearer " + user.accessToken };
    } else {
        return {};
    }
}
