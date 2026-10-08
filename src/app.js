const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from test server");
});

app.use("/", (req, res) => {
  res.send("Hello from dev1");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
