import { SlackEventModel } from "../model";
import { SlackEventRepository } from "../repository";

export class SlackEventService {
  private slackEventRepository: SlackEventRepository;

  constructor() {
    this.slackEventRepository = new SlackEventRepository();
  }

  store(slackEvent: SlackEventModel): void {
    this.slackEventRepository.store(slackEvent);
  }

  exists(slackEvent: SlackEventModel): boolean {
    const slackEventList: SlackEventModel[] = this.slackEventRepository.findAll();
    for (let i = 0; i < slackEventList.length; i++) {
      if (slackEvent.equals(slackEventList[i])) {
        return true;
      }
    }
    return false;
  }
}
