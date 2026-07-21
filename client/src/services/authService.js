const USERS_KEY = "mock_registered_users";

function getStoredUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function registerUser({ fullName, username, email, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getStoredUsers();

      const usernameTaken = users.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
      const emailTaken = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (usernameTaken) {
        reject(new Error("This username is already taken."));
        return;
      }
      if (emailTaken) {
        reject(new Error("An account with this email already exists."));
        return;
      }

      const newUser = { fullName, username, email, password };
      saveStoredUsers([...users, newUser]);
      resolve({ fullName, username, email });
    }, 600);
  });
}