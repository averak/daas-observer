import { DajareModel } from "../../model";

export interface FetchDajareResponse {
  status: "OK" | "NG";
  num: number;
  dajare: DajareModel[];
}
