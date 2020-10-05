import "@aws-cdk/assert/jest";
import { App, Stack } from "@aws-cdk/core";

import { SlackPipelineApproval } from "../src";

test("Snapshot", () => {
  const app = new App();
  const stack = new Stack(app, "testing-stack");

  new SlackPipelineApproval(stack, "Approval");

  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});
