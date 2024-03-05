import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("hi");
});
app.listen(3001, () => {
  console.log("http://localhost:3001");
});
