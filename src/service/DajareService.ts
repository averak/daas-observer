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

  judgeDajare(dajare: DajareModel): boolean {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_URL}/judge?dajare=${dajare.getText()}`
    );

    const jsonData: judgeResponse = JSON.parse(
      response.getContentText()
    ) as judgeResponse;

    return jsonData.is_dajare;
  }

  evalDajare(dajare: DajareModel): number {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_URL}/eval?dajare=${dajare.getText()}`
    );

    const jsonData: evalResponse = JSON.parse(
      response.getContentText()
    ) as evalResponse;

    return jsonData.score;
  }

  readingDajare(dajare: DajareModel): string {
    const response = UrlFetchApp.fetch(
      `${DAJARE_API_URL}/reading?dajare=${dajare.getText()}`
    );

    const jsonData: readingResponse = JSON.parse(
      response.getContentText()
    ) as readingResponse;

    return jsonData.reading;
  }

  preprocessing(
    dajare: DajareModel,
    replaceMode: "kana" | "origin"
  ): DajareModel {
    const result = dajare.clone();

    // "{AAA|BBB}" -> "AAA" or "BBB"
    if (replaceMode == "kana") {
      result.setText(
        result.getText().replace(/\{([^{|}]+)\|([^{|}]+)\}/g, "$2")
      );
    } else {
      result.setText(
        result.getText().replace(/\{([^{|}]+)\|([^{|}]+)\}/g, "$1")
      );
    }

    return result;
  }

  fetchDajare(num: number): DajareModel[] {
    const result = this.dajareRepository.findByIsDajare(true);
    return result.slice(0, num);
  }

  store(dajare: DajareModel): void {
    this.dajareRepository.store(dajare);
  }

  getRanking(term: "weekly" | "monthly", num = 10): DajareModel[] {
    let result: DajareModel[] = [];

    switch (term) {
      case "weekly":
        result = this.findDajareForPeriod(7);
        break;
      case "monthly":
        result = this.findDajareForPeriod(31);
        break;
    }

    // sort
    result.sort((a, b) => (a.getScore() < b.getScore() ? 1 : -1));

    return result.slice(0, num);
  }

  private findDajareForPeriod(days: number): DajareModel[] {
    const result: DajareModel[] = [];
    const today = new Date();

    this.dajareRepository.findByIsDajare(true).forEach((dajare) => {
      if ((today.getTime() - dajare.getDate().getTime()) / 86400000 < days) {
        result.push(dajare);
      }
    });

    return result;
  }
}
