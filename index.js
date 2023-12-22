const express = require("express");
const fs = require("fs");

let users = require("./MOCK_DATA.json");
const app = express();
PORT = 8000;

//Middleware- Plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${Date.now()}: ${req.method}: ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
});

app.get("/api/users", (req, res) => {
  res.setHeader("X-MyName", "Rasmeet Kour");
  return res.json(users);
});

// Routes
app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id); // get the id
    const user = users.find((user) => user.id === id); //find the id
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json(user);
  })

  .patch((req, res) => {
    //Edit user Id
    return res.json({ status: "Pending" });
  })
  .delete((req, res) => {
    //Delete user id
    const id = Number(req.params.id);
    users = users.filter((user) => user.id !== id);
    // Check if any user was removed (length of the new array is smaller)
    if (users.length < users.length + 1) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      // If user is not found, return a 404 response
      res.status(404).json({ message: "User not found" });
    }
  });

app.post("/api/users", (req, res) => {
  //Create new user
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  )
    return res.status(400).json({ msg: "All fields are required" });
  //console.log(body);
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "success", id: users.length });
  });
});

app.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
