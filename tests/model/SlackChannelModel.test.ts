import { SlackChannelModel } from "../../src/model";

// create sample object
const channelId = "XXXXXXXXXXX";
const channelName = "general";
const channelWebhookURL = "https://xxxxxxx";
const slackChannel = new SlackChannelModel(channelId);
slackChannel.setName(channelName);
slackChannel.setWebhookURL(channelWebhookURL);

test("SlackChannelModelのプロパティをテスト", () => {
  expect(slackChannel.getId()).toBe(channelId);
  expect(slackChannel.getName()).toBe(channelName);
  expect(slackChannel.getPostable()).toBe(true);
  expect(slackChannel.getWebhookURL()).toBe(channelWebhookURL);
});
