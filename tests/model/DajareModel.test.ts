import { DajareModel } from '../../src/model';

const dajareText = '布団が吹っ飛んだ';
const dajare: DajareModel = new DajareModel(dajareText);

test('DajareModelのプロパティをテスト', () => {
  expect(dajare.getText()).toBe(dajareText);
});
