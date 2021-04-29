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
    return this.eventRepository.findAll().indexOf(event) != -1;
  }
}
