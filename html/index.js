<<<<<<< HEAD
const ajax = (url) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          resolve(xhr.responseText);
        } else {
          reject(xhr.statusText);
        }
      }
    };
  });
};

Promise.allSettled([ajax("/api/users"), ajax("/api/urls")])
  .then((results) => {
    console.log(results);
  })
  .catch((error) => {
    console.error(error);
  });
=======
"use strict";
const getUserList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { name: "张三", age: 18 },
        { name: "李四", age: 19 },
        { name: "王五", age: 20 },
      ]);
    }, 1000);
  });
};
const getBannerList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { name: "Banner1", id: 1 },
        { name: "Banner2", id: 2 },
        { name: "Banner3", id: 3 },
      ]);
    }, 2000);
  });
};
const getVideoList = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { title: "JavaScript", id: 1 },
        { title: "TypeScript", id: 2 },
        { title: "Vue", id: 3 },
      ]);
    }, 3000);
  });
};
const initLoad = () => {
  Promise.all([getUserList(), getBannerList(), getVideoList()]).then((res) => {
    console.log(res);
    console.log("用户列表", res[0]);
    console.log("轮播图列表", res[1]);
    console.log("视频列表", res[2]);
  });
};
initLoad();
>>>>>>> 1af4b938efa05e75d63ec1cc6e2e7c8b5fed565e
