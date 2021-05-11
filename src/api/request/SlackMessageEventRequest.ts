export interface SlackMessageEventRequest {
  type: string;
  challenge: string;
  event_id: string;
  event: {
    type: string;
    channel: string;
    user: string;
    text: string;
    ts: string;
  };
}
