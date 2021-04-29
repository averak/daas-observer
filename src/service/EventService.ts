import { EventModel } from "../model";
import { EventRepository } from "../repository";

export class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  store(event: EventModel): void {
    this.eventRepository.store(event);
  }

  exists(event: EventModel): boolean {
    const eventList: EventModel[] = this.eventRepository.findAll();
    for (let i = 0; i < eventList.length; i++) {
      if (event.equals(eventList[i])) {
        return true;
      }
    }
    return false;
  }
}
