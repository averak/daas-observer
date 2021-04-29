import { AuthorModel } from "../../src/model";

// create sample object
const authorId = "XXXXXXXXXXX";
const author = new AuthorModel(authorId);

test("AuthorModelのプロパティをテスト", () => {
  expect(author.getId()).toBe(authorId);
});
