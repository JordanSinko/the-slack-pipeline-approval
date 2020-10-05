import "@aws-cdk/assert/jest";
import { App, Stack } from "@aws-cdk/core";

import { SlackApproval } from "../src";

test("Snapshot", () => {
  const app = new App();
  const stack = new Stack(app, "testing-stack");

  const approval = new SlackApproval(stack, "Approval", { slackToken: "xoxb-12345" });
  approval.addApprovalAction("Approval", { actionName: "Approval", slackChannel: "1" });

  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});
