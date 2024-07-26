const Request = (url, params, cb) => {
    fetch(url, params)
      .then((response) => response.json())
      .then((response) => cb(response))
      .catch((error) => alert(error));
  };
  
  export default Request;