import { EventIdRepository } from "../repository";

export class EventIdService {
  private eventIdRepository: EventIdRepository;

  constructor() {
    this.eventIdRepository = new EventIdRepository();
  }

  store(eventId: string): void {
    this.eventIdRepository.store(eventId);
  }

  exists(eventId: string): boolean {
    return this.eventIdRepository.findAll().indexOf(eventId) != -1;
  }
}
