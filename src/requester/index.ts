import phin from "phin";
import { SNSEvent } from "aws-lambda";

const { AWS_REGION, AWS_ACCOUNT_ID } = process.env;
const { SLACK_TOKEN } = process.env;

interface Approval {
  consoleLink: string;
  pipelineName: string;
  stageName: string;
  actionName: string;
  expires: string;
  externalEntityLink?: string;
  customData?: string;
}

interface ApprovalCustomData {
  slackChannel: string;
  slackUsername?: string;
  slackIcon?: string;
  userInformation?: string;
}

export const handler = async (event: SNSEvent) => {
  const message = event.Records[0].Sns.Message;
  const { consoleLink, approval } = JSON.parse(message) as { consoleLink: string; approval: Approval };
  const {
    pipelineName: pipeline,
    stageName: stage,
    actionName: action,
    expires,
    externalEntityLink,
    customData,
  } = approval;

  const approvalContext = { ...approval, consoleLink, region: AWS_REGION, account: AWS_ACCOUNT_ID };
  const data: ApprovalCustomData = JSON.parse(customData ?? "{}");

  const { slackChannel, slackIcon, slackUsername, userInformation } = data;

  await phin({
    method: "POST",
    url: "https://slack.com/api/chat.postMessage",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SLACK_TOKEN}` },
    parse: "json",
    data: {
      channel: slackChannel,
      username: slackUsername,
      icon_emoji: slackIcon,
      attachments: [
        {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*<${consoleLink} | CodePipeline Approval | ${pipeline} | Region: ${AWS_REGION} | Account: ${AWS_ACCOUNT_ID}>*`,
              },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Pipeline:*\n${pipeline}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Stage:*\n${stage}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Action:*\n${action}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Expires:*\n${expires}`,
                },
              ],
            },
            userInformation && {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Additional information*\n${userInformation}`,
                },
              ],
            },
            externalEntityLink && {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Content to review*\n${externalEntityLink}`,
                },
              ],
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Status*\n:hourglass: Pending`,
                },
              ],
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    emoji: true,
                    text: "Approve",
                  },
                  style: "primary",
                  value: `${JSON.stringify({ approved: true, context: approvalContext })}`,
                },
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    emoji: true,
                    text: "Deny",
                  },
                  style: "danger",
                  value: `${JSON.stringify({ approved: false, context: approvalContext })}`,
                },
              ],
            },
          ].filter(Boolean),
        },
      ],
    } as Record<string, any>,
  });

  return;
};
