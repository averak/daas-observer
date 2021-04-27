import { Dajare } from "./";

export class DajareService {
  public static toArray(
    dajare: Dajare
  ): (string | string[] | number | boolean)[] {
    return [
      dajare.text,
      dajare.reading,
      dajare.isDajare,
      dajare.score,
      dajare.sensitiveTags,
      dajare.isSensitive,
      dajare.author,
    ];
  }
}
