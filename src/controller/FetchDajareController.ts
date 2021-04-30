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
    const num: number = params.num || 0;

    // fetch dajare
    const dajareList = this.dajareService.fetchDajare(num);
    LogUtil.logging("called fetchDajare API", "INFO");

    // create json response
    const result: FetchDajareResponse = {
      status: "OK",
      num: dajareList.length,
      dajare: dajareList,
    };

    return ContentService.createTextOutput(JSON.stringify(result));
  }
}
