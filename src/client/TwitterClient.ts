import { EnvService } from "../service";

export class TwitterClient {
  private envService: EnvService;

  constructor() {
    this.envService = new EnvService();
  }

  postMessage(message: string): void {
    return;
  }
}
