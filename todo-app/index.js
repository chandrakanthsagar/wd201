/* eslint-disable no-undef */

const app = require("./app"); // importing app module

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Started express server at port 3000");
});
