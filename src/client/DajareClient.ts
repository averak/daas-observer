import { DajareModel } from "../model";

interface judgeResponse {
  status: string;
  message: string;
  is_dajare: boolean;
  applied_rule: string;
}

export class DajareClient {
  judgeDajare(dajare: DajareModel): DajareModel {
    let response: GoogleAppsScript.URL_Fetch.HTTPResponse;

    try {
      response = UrlFetchApp.fetch(
        `https://api.abelab.dev/daas/judge/?dajare=${dajare.getText()}`
      );
    } catch (e) {
      dajare.setIsDajare(false);
      return dajare;
    }

    const jsonData: judgeResponse = JSON.parse(
      response.getContentText()
    ) as judgeResponse;
    dajare.setIsDajare(jsonData.is_dajare);

    return dajare;
  }
}
