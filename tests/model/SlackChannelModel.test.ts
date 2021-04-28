import { SlackChannelModel } from "../../src/model";

// create sample object
const channelID = "XXXXXXXXXXX";
const channelName = "general";
const channelWebhookURL = "https://xxxxxxx";
const slackChannel = new SlackChannelModel(channelID);
slackChannel.setName(channelName);
slackChannel.setWebhookURL(channelWebhookURL);

test("SlackChannelModelのプロパティをテスト", () => {
  expect(slackChannel.getID()).toBe(channelID);
  expect(slackChannel.getName()).toBe(channelName);
  expect(slackChannel.getWebhookURL()).toBe(channelWebhookURL);
});
