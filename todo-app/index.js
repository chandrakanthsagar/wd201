/* eslint-disable no-unused-vars */

const app = require("./app");
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log("Started express server at port 3000");
});
