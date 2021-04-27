// dajare api
export const DAJARE_API_ROOT = "https://api.abelab.dev/daas";

// dajare engine renponses
export interface judgeResponse {
  status: string;
  message: string;
  is_dajare: boolean;
  applied_rule: string;
}
export interface evalResponse {
  status: string;
  message: string;
  score: number;
}
export interface readingResponse {
  status: string;
  message: string;
  reading: string;
}
