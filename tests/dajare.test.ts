import { Dajare, DajareRepository, DajareService } from '../src/dajare';

const dajareText = '布団が吹っ飛んだ';
const dajare: Dajare = new Dajare(dajareText);

test('Dajare: create dajare', () => {
  expect(dajare.text).toBe(dajareText);
  expect(typeof dajare.reading).toBe('string');
  expect(typeof dajare.isDajare).toBe('boolean');
  expect(typeof dajare.score).toBe('number');
  expect(typeof dajare.sensitiveTags).toBe('object');
  expect(typeof dajare.isSensitive).toBe('boolean');
});

test('DajareService: convert to array', () => {
  const dajareArray = DajareService.toArray(dajare);
  expect(dajareArray.length).toBe(7);
  expect(dajareArray[0]).toBe(dajare.text);
  expect(dajareArray[1]).toBe(dajare.reading);
  expect(dajareArray[2]).toBe(dajare.isDajare);
  expect(dajareArray[3]).toBe(dajare.score);
  expect(dajareArray[4]).toStrictEqual(dajare.sensitiveTags);
  expect(dajareArray[5]).toBe(dajare.isSensitive);
  expect(dajareArray[6]).toBe(dajare.author);
});
