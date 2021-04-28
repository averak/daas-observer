import { AuthorModel } from "../../src/model";

// create sample object
const authorName = "山田 太郎";
const authorId = "XXXXXXXXXXX";
const authorIsBot = false;
const author = new AuthorModel(authorId);
author.setName(authorName);
author.setIsBot(authorIsBot);

test("AuthorModelのプロパティをテスト", () => {
  expect(author.getId()).toBe(authorId);
  expect(author.getName()).toBe(authorName);
  expect(author.getIsBot()).toBe(authorIsBot);
});
