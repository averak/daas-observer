import { EnvModel } from "../model";
import { EnvRepository } from "../repository";

export class EnvService {
  private envRepository: EnvRepository;

  constructor() {
    this.envRepository = new EnvRepository();
  }

  getEnv(name: string): string {
    const env: EnvModel | undefined = this.envRepository.findByName(name);
    if (env == undefined) {
      return "";
    } else {
      return env.getValue();
    }
  }
}
