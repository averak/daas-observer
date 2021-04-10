// DaaS config
const DAAS_BASE_URL = 'https://api.abelab.dev/daas';
export const DAAS_JUDGE_URL = (dajare: string): string =>
  `${DAAS_BASE_URL}/judge/?dajare=${dajare}`;
export const DAAS_EVAL_URL = (dajare: string): string =>
  `${DAAS_BASE_URL}/eval/?dajare=${dajare}`;
export const DAAS_READING_URL = (dajare: string): string =>
  `${DAAS_BASE_URL}/eval/?dajare=${dajare}`;
export type JudgeResponse = {
  status: string;
  message: string;
  is_dajare: boolean;
};
export type EvalResponse = {
  status: string;
  message: string;
  score: number;
};
export type ReadingResponse = {
  status: string;
  message: string;
  reading: string;
};
