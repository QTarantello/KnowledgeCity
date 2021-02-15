const USER_CREDENTIALS = {
  username: "qtarantello",
  password: "12345678",
};

function checkCredentials({ username, password }) {
  return (
    username.trim() === USER_CREDENTIALS.username &&
    password === USER_CREDENTIALS.password
  );
}

const USERS = {
  1: {
    pagination: { offset: 1, limit: 3 },
    users: [
      { id: 0, username: "Pipi", name: "Abiha Carver" },
      { id: 1, username: "Loco", name: "Jibril Cote" },
      { id: 2, username: "Sassy", name: "Grover Watson" },
      { id: 3, username: "Kindle", name: "Haaris Bowman" },
      { id: 4, username: "Glide", name: "Dorian Williamson" },
    ],
  },
  2: {
    pagination: { offset: 2, limit: 3 },
    users: [
      { id: 5, username: "Buzz", name: "Ruby-Leigh Bird" },
      { id: 6, username: "Bulldog", name: "Evie-Grace Drew" },
      { id: 7, username: "Hammer", name: "Malaika Blevins" },
      { id: 8, username: "Stretch", name: "Presley Villalobos" },
      { id: 9, username: "Pugs", name: "Amy-Leigh Manning" },
    ],
  },
  3: {
    pagination: { offset: 3, limit: 3 },
    users: [
      { id: 10, username: "Kiki", name: "Jibril Manning" },
      { id: 11, username: "Marvel", name: "Malaika Bowman" },
    ],
  },
};

function getUsersResponse(offset = 1) {
  if (offset in USERS) {
    return USERS[offset];
  } else {
    return USERS[0];
  }
}
