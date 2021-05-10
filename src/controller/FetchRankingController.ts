import { DajareModel } from "../model";
import { RankingService } from "../service";
import { LogUtil } from "../util";

interface GetRequest {
  num: number;
  period: "weekly" | "monthly";
}

interface FetchRankingResponse {
  status: "OK" | "NG";
  num: number;
  text: string;
  dajare: DajareModel[];
}

export class FetchRankingController {
  private rankingService: RankingService;

  constructor() {
    this.rankingService = new RankingService();
  }

  fetchRanking(
    e: GoogleAppsScript.Events.DoGet
  ): GoogleAppsScript.Content.TextOutput {
    const params: GetRequest = e.parameter as GetRequest;
    const period = params.period || "weekly";
    let num: number = params.num || 10;

    // fetch dajare
    const dajareList = this.rankingService.getRanking(period, num);
    num = dajareList.length;

    // create json response
    const result: FetchRankingResponse = {
      status: "OK",
      num: num,
      text: `period: ${period}, num: ${num}`,
      dajare: dajareList,
    };

    LogUtil.logging(`called ranking API, return ${num} dajare`, "INFO");

    return ContentService.createTextOutput(JSON.stringify(result));
  }
}
