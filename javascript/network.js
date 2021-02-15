const fetchWithDelay = (cb) => setTimeout(cb, 500);

const fetch = (url, options) =>
  new Promise((resolve, _reject) => {
    const [path, query = ""] = url.split("?");

    switch (path) {
      case "/auth":
        switch (options.method) {
          case "POST":
            let code;
            if (checkCredentials(options.body)) {
              code = 200;
            } else {
              code = 401;
            }

            fetchWithDelay(() => resolve({ code }));
            break;
          case "DELETE":
            fetchWithDelay(() => resolve({ code: 200 }));
            break;
          default:
            fetchWithDelay(() => resolve({ code: 404 }));
        }
      case "/users":
        switch (options.method) {
          case "GET":
            const [param, paramValue] = query.split("=");
            const offset = parseInt(paramValue);

            let users;
            if (param === "page" && offset !== NaN) {
              users = getUsersResponse(offset);
            } else {
              users = getUsersResponse();
            }

            fetchWithDelay(() => resolve({ code: 200, data: users }));
            break;
          default:
            fetchWithDelay(() => resolve({ code: 404 }));
        }
      default:
        fetchWithDelay(() => resolve({ code: 404 }));
    }
  });
