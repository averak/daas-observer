import { AuthorModel } from "../model";
import { EnvService } from "../service";

interface postParams {
  ok: boolean;
  members: [
    {
      id: string;
      is_bot: boolean;
      profile: {
        display_name: string;
      };
    }
  ];
}

export class AuthorRepository {
  private authors!: AuthorModel[];
  private envService: EnvService;

  constructor() {
    this.envService = new EnvService();
    this.updateAuthors();
  }

  findAll(): AuthorModel[] {
    const result: AuthorModel[] = [];

    let response: GoogleAppsScript.URL_Fetch.HTTPResponse;
    try {
      response = UrlFetchApp.fetch("https://slack.com/api/users.list", {
        method: "get",
        contentType: "application/x-www-form-urlencoded",
        payload: {
          token: this.envService.getEnv("SLACK_TOKEN"),
        },
      });
    } catch (e) {
      return result;
    }

    const jsonData: postParams = JSON.parse(
      response.getContentText()
    ) as postParams;
    jsonData.members.forEach((member) => {
      const author = new AuthorModel(member.id);
      author.setName(member.profile.display_name);
      author.setIsBot(member.is_bot);
      result.push(author);
    });

    return result;
  }

  updateAuthors(): void {
    this.authors = this.findAll();
  }

  findById(id: string): AuthorModel | undefined {
    for (let i = 0; i < this.authors.length; i++) {
      if (id == this.authors[i].getId()) {
        return this.authors[i];
      }
    }

    return undefined;
  }
}
