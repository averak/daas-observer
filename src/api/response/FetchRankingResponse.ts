import { DajareModel } from "../../model";

export interface FetchRankingResponse {
  status: "OK" | "NG";
  num: number;
  dajare: DajareModel[];
}
