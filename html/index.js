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
