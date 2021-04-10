import { Dajare } from '../src/dajare';

test('create dajare', () => {
  const dajareText = '布団が吹っ飛んだ';
  const dajare: Dajare = new Dajare(dajareText);
  expect(dajare.text).toBe(dajareText);
  expect(typeof dajare.reading).toBe('string');
  expect(typeof dajare.isDajare).toBe('boolean');
  expect(typeof dajare.score).toBe('number');
  expect(typeof dajare.sensitiveTags).toBe('object');
  expect(typeof dajare.isSensitive).toBe('boolean');
});
