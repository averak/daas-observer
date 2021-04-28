import { AuthorModel } from "../model";
import { TokenService } from "../service";
import { SlackUtil } from "../util";

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
  private tokenService: TokenService;

  constructor() {
    this.tokenService = new TokenService();
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
          token: this.tokenService.getSlackToken(),
        },
      });
    } catch (e) {
      SlackUtil.logging("ERROR: failed to fetch user list");
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
