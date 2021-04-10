import { doGet } from './api';

declare const global: {
  [x: string]: any;
};

global.doGet = doGet;
