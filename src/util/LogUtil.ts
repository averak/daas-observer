import { SlackService } from "../service";
import { LOG_CHANNEL_NAME } from "../config";

const slackService = new SlackService();

export class LogUtil {
  static logging(logMessage: string): void {
    slackService.postMessage(LOG_CHANNEL_NAME, logMessage);
  }
}
