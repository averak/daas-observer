import { DajareModel } from "../../src/model";
import { DajareClient } from "../../src/client";

// create sample object
const dajareText = "布団が吹っ飛んだ";
const dajare = new DajareModel(dajareText);

const dajareClient = new DajareClient();

test("判定エンジンをテスト", () => {
  expect(typeof dajareClient.judgeDajare(dajare).getIsDajare()).toBe("boolean");
});

test("評価エンジンをテスト", () => {
  expect(typeof dajareClient.evalDajare(dajare).getScore()).toBe("number");
});

test("カタカナ化エンジンをテスト", () => {
  expect(typeof dajareClient.readingDajare(dajare).getReading()).toBe("string");
});
