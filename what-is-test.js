const request = require("supertest");
const app = require("./app");
const db = require("./models");

beforeAll(async () => {
await db.sequelize.sync();
jest.spyOn(Date, "now").mockImplementation(() => new Date("2022-10-11"));
});

describe("통합테스트", () => {
test("POST /users/signup 테스트", async () => {
await request(app)
.post("/users/signup")
.send({
username: "username",
password: "hi11",
confirmPassword: "hi11",
})
.expect(200)
.then((res) => {
expect(res.body).toStrictEqual({});
});
});

test("POST /users/login 테스트", async () => {
await request(app)
.post("/users/login")
.send({
username: "username",
password: "hi11",
})
.expect(200)
.then((res) => {
expect(res.body).toStrictEqual({
token:
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0",
});
});
});

test("POST /posts 테스트", async () => {
await request(app)
.post("/posts")
.send({
title: "제목입니다",
content: "내용입니다",
})
.set(
"Authorization",
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0"
)
.expect(200)
.then((res) => {
const { title, content } = res.body.data;
expect({ title, content }).toStrictEqual({
title: "제목입니다",
content: "내용입니다",
});
});
});

test("PATCH /posts/:postId", async () => {
await request(app)
.patch("/posts/1")
.send({
title: "수정된 제목입니다.",
content: "수정된 내용입니다.",
})
.set(
"Authorization",
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0"
)
.expect(200)
.then((res) => {
const { title, content } = res.body.data;

expect({ title, content }).toStrictEqual({
title: "수정된 제목입니다.",
content: "수정된 내용입니다.",
});
});
});

test("GET /posts", async () => {
await request(app)
.get("/posts")
.set(
"Authorization",
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0"
)
.expect(200)
.then((res) => {
const { title, content } = res.body.data[0];
expect({ title, content }).toStrictEqual({
content: "수정된 내용입니다.",
title: "수정된 제목입니다.",
});
});
});

test("GET /posts/:postId", async () => {
await request(app)
.get("/posts/1")
.set(
"Authorization",
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0"
)
.expect(200)
.then((res) => {
const { title, content } = res.body.data;
expect({ title, content }).toStrictEqual({
content: "수정된 내용입니다.",
title: "수정된 제목입니다.",
});
});
});

test("POST /posts/:postId/likes (좋아요 생성)", async () => {
await request(app)
.post("/posts/1/likes")
.set(
"Authorization",
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0"
)
.expect(200)
.then((res) => {
expect(res.body).toStrictEqual({});
});
});

test("POST /posts/:postId/likes (좋아요 삭제)", async () => {
await request(app)
.post("/posts/1/likes")
.set(
"Authorization",
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0"
)
.expect(200)
.then((res) => {
expect(res.body).toStrictEqual({});
});
});

test("POST /posts/:postId/comments", async () => {
await request(app)
.post("/posts/1/comments")
.set(
"Authorization",
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0"
)
.send({
comment: "댓글입니다.",
})
.expect(200)
.then((res) => {
expect(res.body).toBeTruthy();
});
});

test("PATCH /posts/:postId/comments/:commentId", async () => {
await request(app)
.patch("/posts/1/comments/1")
.set({
Authorization:
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2NTQ0NjQwMH0.NhRSF5wsbQBExTSkZdVhFhvctQjYebyP_b6Q35elcm0",
})
.send({
comment: "댓글 수정입니다.",
})
.expect(200)
.then((res) => {
expect(res.body).toBeTruthy();
});
});

test("/ DELETE /posts/:postId/comments/:commentId", async () => {
await request(app).delete("/");
});
});