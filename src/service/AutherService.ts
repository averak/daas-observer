import { AuthorModel } from "../model";
import { AuthorRepository } from "../repository";

export class AuthorService {
  private authorRepository: AuthorRepository;

  constructor() {
    this.authorRepository = new AuthorRepository();
  }

  findById(id: string): AuthorModel | undefined {
    if (this.exists(id)) {
      return this.authorRepository.findById(id);
    }
    return undefined;
  }

  exists(id: string): boolean {
    if (this.authorRepository.findById(id) == undefined) {
      this.authorRepository.findAll();
      return this.authorRepository.findById(id) != undefined;
    } else {
      return true;
    }
  }
}
