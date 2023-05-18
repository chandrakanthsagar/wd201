/* eslint-disable no-undef */
const request = require("supertest");

const db = require("../models/index");
const app = require("../app");
var cheerio = require("cheerio");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

// eslint-disable-next-line no-undef
describe("Todo test suite", function () {
  beforeAll(async () => {
    // to run all rows before each test starts
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });
  test("Sign up for first user", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstName: "Test",
      lastName: "User A",
      email: "user.a@test.com",
      password: "12345678",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });

  // test("Creates a todo and responds with json at /todos POST endpoint", async () => {
  //   const res = await agent.get("/");
  //   const csrfToken = extractCsrfToken(res);
  //   const response = await agent.post("/todos").send({
  //     title: "Buy milk",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     _csrf: csrfToken,
  //   });
  //   expect(response.statusCode).toBe(302);
  // });

  // test("Update a todo with given ID as complete /incomplete ", async () => {
  //   let res = await agent.get("/todos");
  //   let csrfToken = extractCsrfToken(res);
  //   await agent.post("/todos").send({
  //     title: "Buy movietickets",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     _csrf: csrfToken,
  //   });

  //   const groupedTodosResponse = await agent
  //     .get("/")
  //     .set("Accept", "application/json");

  //   const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text); //
  //   const dueTodayCount = parsedGroupedResponse.dueToday.length;
  //   const latesttd = parsedGroupedResponse.dueToday[dueTodayCount - 1];

  //   res = await agent.get("/");
  //   csrfToken = extractCsrfToken(res);

  //   const markCompleteResponse = await agent.put(`/todos/${latesttd.id}`).send({
  //     _csrf: csrfToken,
  //     completed: true,
  //   });

  //   const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
  //   expect(parsedUpdateResponse.completed).toBe(true);

  //   res = await agent.get("/");
  //   csrfToken = extractCsrfToken(res);

  //   const markCompleteResponse1 = await agent
  //     .put(`/todos/${latesttd.id}`)
  //     .send({
  //       _csrf: csrfToken,
  //       completed: false,
  //     });

  //   const parsedUpdateResponse1 = JSON.parse(markCompleteResponse1.text);
  //   expect(parsedUpdateResponse1.completed).toBe(false);
  // });

  // test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //   // FILL IN YOUR CODE HERE
  //   let res = await agent.get("/");
  //   let csrfToken = extractCsrfToken(res); // ensuring there is no csrf attacks
  //   await agent.post("/todos").send({
  //     title: "Buy milk",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     _csrf: csrfToken,
  //   });

  //   const groupedTodosResponse = await agent
  //     .get("/")
  //     .set("Accept", "application/json");

  //   const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
  //   const dueTodayCount = parsedGroupedResponse.dueToday.length;

  //   const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

  //   const todoID = latestTodo.id;
  //   var c = await agent.delete(`/todos/${todoID}`).send({ _csrf: csrfToken });

  //   expect(c.text).toBe("true"); // item deleted sucessfully text is returning string response

  //   c = await agent.delete(`/todos/${todoID}`).send({ _csrf: csrfToken }); // testing to delete the test
  //   expect(c.text).toBe("false"); // item alreay deleted
  // });
});
