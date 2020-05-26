import * as AWS from "aws-sdk";
import { _handler } from "./_handler";
import { Forbidden } from "./errors";

export const handler = _handler(async (event) => {
  console.log("Payload", event.body);

  const body: unknown = JSON.parse(event.body || "{}");

  return {};
});
