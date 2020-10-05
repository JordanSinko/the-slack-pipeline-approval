import "@aws-cdk/assert/jest";
import { SecretValue, Stack } from "@aws-cdk/core";
import { Artifact, Pipeline } from "@aws-cdk/aws-codepipeline";
import { GitHubSourceAction } from "@aws-cdk/aws-codepipeline-actions";

import { SlackApproval } from "../src";

test("should include approval action, requester function and approver function", () => {
  const stack = new Stack();

  // GIVEN
  const sourceArtifact = new Artifact();
  const approval = new SlackApproval(stack, "Approval", { slackToken: "xoxb-12345" });

  // WHEN
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

  // THEN
  expect(stack).toHaveResourceLike("AWS::CodePipeline::Pipeline", {
    Stages: [
      { Actions: [{ Name: "GitHub" }], Name: "Source" },
      { Actions: [{ Configuration: { CustomData: '{"slackChannel":"1"}' }, Name: "Approval" }], Name: "Approval" },
    ],
  });

  expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    Runtime: "nodejs12.x",
    Environment: {
      Variables: { HANDLER_TYPE: "Approver", AWS_ACCOUNT_ID: { Ref: "AWS::AccountId" }, SLACK_TOKEN: "xoxb-12345" },
    },
  });

  expect(stack).toHaveResourceLike("AWS::Lambda::Function", {
    Runtime: "nodejs12.x",
    Environment: {
      Variables: { HANDLER_TYPE: "Requester", AWS_ACCOUNT_ID: { Ref: "AWS::AccountId" }, SLACK_TOKEN: "xoxb-12345" },
    },
  });
});
