import { DajareModel } from "../model";
import { DajareService } from "../service";
import { LogUtil } from "../util";

interface getParams {
  num: number;
}

export class FetchDajareController {
  private dajareService: DajareService;

  constructor() {
    this.dajareService = new DajareService();
  }

  fetchDajare(
    e: GoogleAppsScript.Events.DoGet
  ): GoogleAppsScript.Content.TextOutput {
    const params: getParams = e.parameter as getParams;
    const num: number = params.num || 0;
    return ContentService.createTextOutput(`dajare: ${num}`);
  }
}
