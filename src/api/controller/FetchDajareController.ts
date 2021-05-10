import { DajareService } from "../../service";
import { LogUtil } from "../../util";

import { FetchDajareResponse, FetchRankingResponse } from "../response";
import { FetchDajareRequest, FetchRankingRequest } from "../request";

export class FetchDajareController {
  private dajareService: DajareService;

  constructor() {
    this.dajareService = new DajareService();
  }

  fetchDajare(
    e: GoogleAppsScript.Events.DoGet
  ): GoogleAppsScript.Content.TextOutput {
    const params = e.parameter as FetchDajareRequest;
    let num: number = params.num || 100;

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

  fetchRanking(
    e: GoogleAppsScript.Events.DoGet
  ): GoogleAppsScript.Content.TextOutput {
    const params = e.parameter as FetchRankingRequest;
    const period = params.period || "weekly";
    let num: number = params.num || 10;

    // fetch dajare
    const dajareList = this.dajareService.getRanking(period, num);
    num = dajareList.length;

    // create json response
    const result: FetchRankingResponse = {
      status: "OK",
      num: num,
      dajare: dajareList,
    };

    LogUtil.logging(`called ranking API, return ${num} dajare`, "INFO");

    return ContentService.createTextOutput(JSON.stringify(result));
  }
}
