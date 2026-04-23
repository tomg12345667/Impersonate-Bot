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
  return JSON.parse(fs.readFileSync("./data.json"));
}

function saveData(data) {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
}

app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input name="username" placeholder="Username"/>
      <input name="password" type="password" placeholder="Password"/>
      <button>Login</button>
    </form>
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
    <h1>Impersonate Control Panel</h1>

    <h3>Blocked Users</h3>
    <p>${data.blockedUsers.join(", ") || "none"}</p>

    <form method="POST" action="/toggle-user">
      <input name="id" placeholder="User ID"/>
      <button>Toggle User</button>
    </form>

    <h3>Blocked Roles</h3>
    <p>${data.blockedRoles.join(", ") || "none"}</p>

    <form method="POST" action="/toggle-role">
      <input name="id" placeholder="Role ID"/>
      <button>Toggle Role</button>
    </form>
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

app.listen(9000, "0.0.0.0", () => {
  console.log("Panel running on port 9000");
});
