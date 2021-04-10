import * as api from '../src/api';

test('api doGet test', () => {
  expect(api).toHaveProperty('doGet');
});
