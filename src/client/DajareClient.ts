import { DajareModel } from "../model";
import {
  DAJARE_API_ROOT,
  judgeResponse,
  evalResponse,
  readingResponse,
} from "../config";

export class DajareClient {
  judgeDajare(dajare: DajareModel): DajareModel {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_ROOT}/judge/?dajare=${dajare.getText()}`
    );

    const jsonData: judgeResponse = JSON.parse(
      response.getContentText()
    ) as judgeResponse;
    dajare.setIsDajare(jsonData.is_dajare);

    return dajare;
  }

  evalDajare(dajare: DajareModel): DajareModel {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_ROOT}/eval/?dajare=${dajare.getText()}`
    );

    const jsonData: evalResponse = JSON.parse(
      response.getContentText()
    ) as evalResponse;
    dajare.setScore(jsonData.score);

    return dajare;
  }

  readingDajare(dajare: DajareModel): DajareModel {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_ROOT}/reading/?dajare=${dajare.getText()}`
    );

    const jsonData: readingResponse = JSON.parse(
      response.getContentText()
    ) as readingResponse;
    dajare.setReading(jsonData.reading);

    return dajare;
  }
}
