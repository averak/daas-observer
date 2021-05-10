import { DajareModel } from "../model";
import { DajareRepository } from "../repository";

// dajare api URL
const DAJARE_API_URL = "https://api.abelab.dev/daas";

// dajare engine responses
interface judgeResponse {
  status: string;
  message: string;
  is_dajare: boolean;
  applied_rule: string;
}
interface evalResponse {
  status: string;
  message: string;
  score: number;
}
interface readingResponse {
  status: string;
  message: string;
  reading: string;
}

export class DajareService {
  private dajareRepository: DajareRepository;

  constructor() {
    this.dajareRepository = new DajareRepository();
  }

  judgeDajare(dajare: DajareModel): DajareModel {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_URL}/judge/?dajare=${dajare.getText()}`
    );

    const jsonData: judgeResponse = JSON.parse(
      response.getContentText()
    ) as judgeResponse;
    dajare.setIsDajare(jsonData.is_dajare);

    return dajare;
  }

  evalDajare(dajare: DajareModel): DajareModel {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_URL}/eval/?dajare=${dajare.getText()}`
    );

    const jsonData: evalResponse = JSON.parse(
      response.getContentText()
    ) as evalResponse;
    dajare.setScore(jsonData.score);

    return dajare;
  }

  readingDajare(dajare: DajareModel): DajareModel {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_URL}/reading/?dajare=${dajare.getText()}`
    );

    const jsonData: readingResponse = JSON.parse(
      response.getContentText()
    ) as readingResponse;
    dajare.setReading(jsonData.reading);

    return dajare;
  }

  fetchDajare(num: number): DajareModel[] {
    const result: DajareModel[] = [];
    const dajareList = this.dajareRepository.findAll();

    // pick out only dajare
    for (let i = 0; i < dajareList.length; i++) {
      if (dajareList[i].getIsDajare()) {
        result.push(dajareList[i]);
      }
    }

    return result.slice(0, num);
  }

  store(dajare: DajareModel): void {
    this.dajareRepository.store(dajare);
  }
}
