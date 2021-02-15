function parseUrl() {
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1];
}

function goToPath(href) {
  window.location.href = href;
}

function bootListPage(offset = 1) {
  if (parseUrl() !== "list.html") {
    goToPath("./list.html");
  }

  fetch(`/users?page=${offset}`, { method: "GET" })
    .then(({ code, data }) => {
      if (code === 200) {
        return renderList(data);
      } else {
        return Promise.reject("Failed to get resource /users");
      }
    })
    .catch((msg) => console.log(msg));
}

function bootLoginPage() {
  localStorage.clear();

  if (parseUrl() !== "login.html") {
    goToPath("./login.html");
  }

  renderLogin().catch((msg) => console.log(msg));
}

function isAuthenticated() {
  const rememberMe = localStorage.getItem("rememberMe");
  if (rememberMe === "once") {
    localStorage.clear();
    return true;
  } else {
    return rememberMe === "always";
  }
}

const boot = () => {
  switch (parseUrl()) {
    case "login.html":
      bootLoginPage();
      break;
    case "list.html":
      if (isAuthenticated()) {
        bootListPage();
      } else {
        bootLoginPage();
      }
      break;
  }
};

window.addEventListener("DOMContentLoaded", () => boot());
