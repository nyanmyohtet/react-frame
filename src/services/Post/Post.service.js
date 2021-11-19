import API from "../../api/api";

export function getPostList(data) {
  const url = "posts/list";

  return new Promise((resolve, reject) => {
    API.post(url, data).then(response => {
      return resolve(response);
    }).catch(error => {
      return reject(error);
    });
  });
}
