import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();

const ADMIN_USER = "admin";
const ADMIN_PASS = "password123";

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "impersonate-secret",
  resave: false,
  saveUninitialized: true
}));

function loadData() {
  if (!fs.existsSync("./data.json")) {
    fs.writeFileSync("./data.json", JSON.stringify({ blockedUsers: [], blockedRoles: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync("./data.json"));
}

function saveData(data) {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
}

const styles = `
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background: #0f172a;
    color: #e2e8f0;
  }

  .container {
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
  }

  h1 {
    text-align: center;
    margin-bottom: 30px;
  }

  .card {
    background: #1e293b;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }

  input {
    padding: 10px;
    border-radius: 8px;
    border: none;
    width: 70%;
    margin-right: 10px;
  }

  button {
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    background: #3b82f6;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background: #2563eb;
  }

  .delete {
    background: #ef4444;
    margin-left: 10px;
  }

  .delete:hover {
    background: #dc2626;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background: #0f172a;
    padding: 10px;
    margin-top: 8px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  form {
    display: inline;
  }

  .center {
    text-align: center;
  }
`;

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.send(`
    <style>${styles}</style>
    <div class="container">
      <div class="card">
        <h1>Login</h1>
        <form method="POST" action="/login" class="center">
          <input name="username" placeholder="Username"/>
          <input name="password" type="password" placeholder="Password"/>
          <button>Login</button>
        </form>
      </div>
    </div>
  `);
});

app.post("/login", (req, res) => {
  if (req.body.username === ADMIN_USER && req.body.password === ADMIN_PASS) {
    req.session.auth = true;
    return res.redirect("/panel");
  }
  res.send("Invalid login");
});

app.get("/panel", (req, res) => {
  if (!req.session.auth) return res.redirect("/login");

  const data = loadData();

  res.send(`
    <style>${styles}</style>
    <div class="container">
      <h1>Impersonate Control Panel</h1>

      <div class="card">
        <h3>Block User</h3>
        <form method="POST" action="/toggle-user">
          <input name="id" placeholder="User ID"/>
          <button>Toggle</button>
        </form>
      </div>

      <div class="card">
        <h3>Blocked Users</h3>
        <ul>
          ${data.blockedUsers.map(id => `
            <li>
              <span>${id}</span>
              <form method="POST" action="/delete-user">
                <input type="hidden" name="id" value="${id}" />
                <button class="delete">Delete</button>
              </form>
            </li>
          `).join("")}
        </ul>
      </div>

      <div class="card">
        <h3>Block Role</h3>
        <form method="POST" action="/toggle-role">
          <input name="id" placeholder="Role ID"/>
          <button>Toggle</button>
        </form>
      </div>

      <div class="card">
        <h3>Blocked Roles</h3>
        <ul>
          ${data.blockedRoles.map(id => `
            <li>
              <span>${id}</span>
              <form method="POST" action="/delete-role">
                <input type="hidden" name="id" value="${id}" />
                <button class="delete">Delete</button>
              </form>
            </li>
          `).join("")}
        </ul>
      </div>
    </div>
  `);
});

app.post("/toggle-user", (req, res) => {
  const data = loadData();
  const id = req.body.id;

  if (data.blockedUsers.includes(id)) {
    data.blockedUsers = data.blockedUsers.filter(x => x !== id);
  } else {
    data.blockedUsers.push(id);
  }

  saveData(data);
  res.redirect("/panel");
});

app.post("/toggle-role", (req, res) => {
  const data = loadData();
  const id = req.body.id;

  if (data.blockedRoles.includes(id)) {
    data.blockedRoles = data.blockedRoles.filter(x => x !== id);
  } else {
    data.blockedRoles.push(id);
  }

  saveData(data);
  res.redirect("/panel");
});

app.post("/delete-user", (req, res) => {
  const data = loadData();
  const id = req.body.id;

  data.blockedUsers = data.blockedUsers.filter(x => x !== id);

  saveData(data);
  res.redirect("/panel");
});

app.post("/delete-role", (req, res) => {
  const data = loadData();
  const id = req.body.id;

  data.blockedRoles = data.blockedRoles.filter(x => x !== id);

  saveData(data);
  res.redirect("/panel");
});

app.listen(9000, "0.0.0.0", () => {
  console.log("Panel running on port 9000");
});
