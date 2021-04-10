import * as api from './api';

declare const global: {
  [x: string]: any;
};

global.doGet = api.doGet;
