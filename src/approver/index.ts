import qs from "querystring";
import CodePipeline from "aws-sdk/clients/codepipeline";
import phin from "phin";
import { APIGatewayEvent } from "aws-lambda";

const { AWS_REGION, AWS_ACCOUNT_ID } = process.env;
const { SLACK_TOKEN } = process.env;

enum Status {
  Approved = "Approved",
  Rejected = "Rejected",
}

enum StatusColor {
  Approved = "#007a5a",
  Rejected = "#9e1e1e",
}

const codepipeline = new CodePipeline({ region: AWS_REGION });

export const handler = async (event: APIGatewayEvent) => {
  if (event.body != null) {
    const body = event.isBase64Encoded === true ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
    const { payload } = qs.parse(body) as { payload: string };
    const parsed = JSON.parse(payload);

    const { actions, user, channel, response_url } = parsed;
    const [action] = actions;
    const { approved, context } = JSON.parse(action.value);
    const { stageName, actionName, pipelineName, token, consoleLink, externalEntityLink, userInformation } = context;

    const status = approved ? Status.Approved : Status.Rejected;
    const statusColor = approved ? StatusColor.Approved : StatusColor.Rejected;

    let statusMessage = approved ? ":tallyhappy: Approved" : ":tallysad: Rejected";

    if (channel?.name !== "directmessage") {
      statusMessage += ` by @${user.name}`;
    }

    await codepipeline
      .putApprovalResult({
        pipelineName,
        stageName,
        actionName,
        token,
        result: {
          status,
          summary: statusMessage,
        },
      })
      .promise();

    await phin({
      method: "POST",
      url: response_url,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${SLACK_TOKEN}` },
      parse: "json",
      data: {
        replace_original: true,
        attachments: [
          {
            color: statusColor,
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*<${consoleLink} | CodePipeline Approval | ${pipelineName} | Region: ${AWS_REGION} | Account: ${AWS_ACCOUNT_ID}>*`,
                },
              },
              {
                type: "section",
                fields: [
                  {
                    type: "mrkdwn",
                    text: `*Pipeline:*\n${pipelineName}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Stage:*\n${stageName}`,
                  },
                  {
                    type: "mrkdwn",
                    text: `*Action:*\n${actionName}`,
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
                    text: `*Status*\n${statusMessage}`,
                  },
                ],
              },
            ].filter(Boolean),
          },
        ],
      } as Record<string, any>,
    });
  }
};
