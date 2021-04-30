import { DajareModel } from "../model";
import { DajareService } from "../service";
import { LogUtil } from "../util";

interface GetRequest {
  num: number;
}

interface FetchDajareResponse {
  status: "OK";
  num: number;
  dajare: DajareModel[];
}

export class FetchDajareController {
  private dajareService: DajareService;

  constructor() {
    this.dajareService = new DajareService();
  }

  fetchDajare(
    e: GoogleAppsScript.Events.DoGet
  ): GoogleAppsScript.Content.TextOutput {
    const params: GetRequest = e.parameter as GetRequest;
    let num: number = params.num || 0;

    // fetch dajare
    const dajareList = this.dajareService.fetchDajare(num);
    num = dajareList.length;

    // create json response
    const result: FetchDajareResponse = {
      status: "OK",
      num: num,
      dajare: dajareList,
    };

    LogUtil.logging(`called fetchDajare API, return ${num} dajare`, "INFO");

    return ContentService.createTextOutput(JSON.stringify(result));
  }
}
