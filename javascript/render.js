function appendChilds(rootEl, childs) {
  childs.forEach((el) => rootEl.appendChild(el));
}

function removeChilds(el) {
  el.innerHTML = "";
}

const renderList = (function () {
  function renderUserRow({ username, name }) {
    const row = document.createElement("div");
    row.setAttribute("class", "table-row");

    const iconCell = document.createElement("div");
    iconCell.setAttribute("class", "table-row-icon");

    const usernameEl = document.createElement("div");
    usernameEl.setAttribute("class", "table-row-name__username");
    usernameEl.appendChild(document.createTextNode(username));

    const nameEl = document.createElement("div");
    nameEl.setAttribute("class", "table-row-name__name");
    nameEl.appendChild(document.createTextNode(name));

    const nameCell = document.createElement("div");
    nameCell.setAttribute("class", "table-row-name");
    appendChilds(nameCell, [usernameEl, nameEl]);

    const groupCell = document.createElement("div");
    groupCell.setAttribute("class", "table-row-group");
    const labelGroup = document.createElement("div");
    labelGroup.setAttribute("class", "table-row-group__label");
    labelGroup.appendChild(document.createTextNode("***"));
    groupCell.appendChild(labelGroup);
    groupCell.appendChild(document.createTextNode("Default group"));

    appendChilds(row, [iconCell, nameCell, groupCell]);

    return row;
  }

  function renderUserTable(users) {
    const table = document.createElement("div");
    table.setAttribute("class", "table");

    const rows = users.map((user) => renderUserRow(user));
    appendChilds(table, rows);

    return table;
  }

  function renderPagination({ offset, limit }) {
    const root = document.createElement("div");
    root.setAttribute("class", "pagination");

    const buttons = Array.from(Array(limit).keys()).map((index) => {
      const elOffset = index + 1;
      if (elOffset === offset) {
        const span = document.createElement("span");
        span.textContent = elOffset;
        span.setAttribute(
          "class",
          "pagination__button pagination__button-active"
        );

        return span;
      } else {
        const button = document.createElement("button");
        button.textContent = elOffset;
        button.setAttribute("class", "pagination__button");
        button.addEventListener("click", () => bootListPage(elOffset));
        return button;
      }
    });

    appendChilds(root, buttons);

    if (offset === limit) {
      return root;
    } else {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Next »";
      nextButton.setAttribute("class", "pagination__button");
      nextButton.addEventListener("click", () => bootListPage(offset + 1));

      root.appendChild(nextButton);

      return root;
    }
  }

  return ({ users, pagination }) => {
    return new Promise((resolve, reject) => {
      const root = document.getElementById("root");
      if (root === null) {
        reject("#root element not found");
      } else {
        const userTableEl = renderUserTable(users);
        const paginationEl = renderPagination(pagination);

        removeChilds(root);
        appendChilds(root, [userTableEl, paginationEl]);

        const logOutButton = document.getElementById("log-out-button");
        if (logOutButton !== null) {
          logOutButton.addEventListener("click", () => {
            fetch("/auth", { method: "DELETE" }).then(() => bootLoginPage());
          });
          resolve();
        } else {
          reject("#log-out-button element not found");
        }
      }
    });
  };
})();

const renderLogin = (function () {
  function renderForm() {
    const form = document.createElement("form");
    form.setAttribute("class", "form");
    return form;
  }

  function renderUsernameField() {
    const field = document.createElement("div");
    field.setAttribute("class", "form-field form-field-username");

    const input = document.createElement("input");
    input.setAttribute("class", "form-field__input");
    input.setAttribute("placeholder", "Username");
    input.setAttribute("type", "text");

    field.appendChild(input);

    return [field, input];
  }

  function renderPasswordField() {
    const field = document.createElement("div");
    field.setAttribute("class", "form-field form-field-password");

    const input = document.createElement("input");
    input.setAttribute("class", "form-field__input");
    input.setAttribute("placeholder", "Password");
    input.setAttribute("type", "password");

    field.appendChild(input);

    return [field, input];
  }

  function renderRememberMeField() {
    const field = document.createElement("label");
    field.setAttribute("class", "form-field form-field-label");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");

    const text = document.createTextNode("Remember me");

    appendChilds(field, [checkbox, text]);

    return [field, checkbox];
  }

  function renderSubmitButton() {
    const submitButton = document.createElement("button");
    submitButton.textContent = "Log In";
    submitButton.setAttribute("class", "form__button");
    return submitButton;
  }

  function auth({ username, password, rememberMe }) {
    fetch("/auth", { method: "POST", body: { username, password } }).then(
      ({ code }) => {
        if (code === 200) {
          if (rememberMe) {
            localStorage.setItem("rememberMe", "always");
          } else {
            localStorage.setItem("rememberMe", "once");
          }

          bootListPage();
        } else {
          alert("Invalid credentials");
        }
      }
    );
  }

  return () => {
    return new Promise((resolve, reject) => {
      const root = document.getElementById("root");
      if (root === null) {
        reject("#root element not found");
      } else {
        const form = renderForm();

        const [usernameField, usernameInput] = renderUsernameField();
        const [passwordField, passwordInput] = renderPasswordField();
        const [rememberMeField, rememberMeCheckbox] = renderRememberMeField();
        const submitButton = renderSubmitButton();

        appendChilds(form, [
          usernameField,
          passwordField,
          rememberMeField,
          submitButton,
        ]);

        form.addEventListener("submit", (event) => {
          event.preventDefault();

          const username = usernameInput.value.trim();
          const password = passwordInput.value.trim();
          const rememberMe = rememberMeCheckbox.checked;

          auth({ username, password, rememberMe });
        });

        removeChilds(root);
        root.appendChild(form);

        resolve();
      }
    });
  };
})();
