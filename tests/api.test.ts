import * as api from '../src/api';

test('basic', () => {
  expect(api.hasOwnProperty('doGet')).toBe(true);
});
