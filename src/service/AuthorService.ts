import { AuthorModel } from "../model";
import { AuthorRepository } from "../repository";
import { LogUtil } from "../util";

export class AuthorService {
  private authorRepository: AuthorRepository;

  constructor() {
    this.authorRepository = new AuthorRepository();
  }

  findById(id: string): AuthorModel | undefined {
    if (this.exists(id)) {
      return this.authorRepository.findById(id);
    } else {
      LogUtil.logging(`cannot find user`, "WARN");
      return undefined;
    }
  }

  exists(id: string): boolean {
    if (this.authorRepository.findById(id) == undefined) {
      this.authorRepository.updateAuthors();
      return this.authorRepository.findById(id) != undefined;
    } else {
      return true;
    }
  }
}
