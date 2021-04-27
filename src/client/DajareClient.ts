import { DajareModel } from "../model";
import {
  DAJARE_API_ROOT,
  judgeResponse,
  evalResponse,
  readingResponse,
} from "../config";

export class DajareClient {
  judgeDajare(dajare: DajareModel): DajareModel {
    let response: GoogleAppsScript.URL_Fetch.HTTPResponse;

    try {
      response = UrlFetchApp.fetch(
        `${DAJARE_API_ROOT}/judge/?dajare=${dajare.getText()}`
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

  evalDajare(dajare: DajareModel): DajareModel {
    let response: GoogleAppsScript.URL_Fetch.HTTPResponse;

    try {
      response = UrlFetchApp.fetch(
        `${DAJARE_API_ROOT}/eval/?dajare=${dajare.getText()}`
      );
    } catch (e) {
      dajare.setScore(1.0);
      return dajare;
    }

    const jsonData: evalResponse = JSON.parse(
      response.getContentText()
    ) as evalResponse;
    dajare.setScore(jsonData.score);

    return dajare;
  }

  readingDajare(dajare: DajareModel): DajareModel {
    let response: GoogleAppsScript.URL_Fetch.HTTPResponse;

    try {
      response = UrlFetchApp.fetch(
        `${DAJARE_API_ROOT}/reading/?dajare=${dajare.getText()}`
      );
    } catch (e) {
      dajare.setReading("");
      return dajare;
    }

    const jsonData: readingResponse = JSON.parse(
      response.getContentText()
    ) as readingResponse;
    dajare.setReading(jsonData.reading);

    return dajare;
  }
}
