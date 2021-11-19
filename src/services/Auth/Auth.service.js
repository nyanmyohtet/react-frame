import API from "../../api/api";
import store from "../../store";
import { LOGIN_SUCCESS } from "../../actions/types";
import { LocalStorage } from "../LocalStorage/LocalStorage.service";

export function login(data) {
  const url = "auth/login";

  return new Promise((resolve, reject) => {
    API.post(url, data).then(response => {
      const { data } = response;
      const { token } = data.success;
      const { user } = data;

      /** store logged in user's info to local storage */
      LocalStorage.set(
        "user",
        JSON.stringify({
          accessToken: token,
          ...user
        })
      );

      /** store logged in user's info to App State */
      store.dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          user: {
            accessToken: token,
            ...user
          },
        }
      });

      return resolve();
    }).catch(error => {
      return reject(error);
    });
  });
}
