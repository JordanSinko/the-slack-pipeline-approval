import "@aws-cdk/assert/jest";
import { App, SecretValue, Stack } from "@aws-cdk/core";
import { Artifact, Pipeline } from "@aws-cdk/aws-codepipeline";
import { GitHubSourceAction } from "@aws-cdk/aws-codepipeline-actions";

import { SlackApproval } from "../src";

test("Snapshot", () => {
  const app = new App();
  const stack = new Stack(app, "testing-stack");

  const sourceArtifact = new Artifact();

  const approval = new SlackApproval(stack, "Approval", { slackToken: "xoxb-12345" });
  new Pipeline(stack, "Pipeline", {
    stages: [
      {
        stageName: "Source",
        actions: [
          new GitHubSourceAction({
            actionName: "GitHub",
            oauthToken: SecretValue.secretsManager("GITHUB_TOKEN"),
            owner: "JordanSinko",
            repo: "the-slack-pipeline-approval",
            output: sourceArtifact,
          }),
        ],
      },
      {
        stageName: "Approval",
        actions: [approval.addApprovalAction("Approval", { actionName: "Approval", slackChannel: "1" })],
      },
    ],
  });

  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});
