import { resolve } from "path";
import { Stack, Construct } from "@aws-cdk/core";
import { IStage, ActionBindOptions, ActionConfig } from "@aws-cdk/aws-codepipeline";
import { ManualApprovalAction, ManualApprovalActionProps } from "@aws-cdk/aws-codepipeline-actions";
import { Topic } from "@aws-cdk/aws-sns";
import { Code, Function as AwsFunction, Runtime } from "@aws-cdk/aws-lambda";
import { HttpApi, HttpMethod, LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2";
import { LambdaSubscription } from "@aws-cdk/aws-sns-subscriptions";
import { PolicyStatement } from "@aws-cdk/aws-iam";

export interface SlackApprovalActionProps extends ManualApprovalActionProps {
  readonly slackChannel: string;
  readonly slackUsername?: string;
  readonly slackIcon?: string;
}

export class SlackApprovalAction extends ManualApprovalAction {
  slackProps: SlackApprovalActionProps;
  approval: SlackApproval;
  id: string;
  slackAdditionalInformation?: string;

  constructor(approval: SlackApproval, id: string, props: SlackApprovalActionProps) {
    const { slackChannel, slackUsername, slackIcon, additionalInformation: _additionalInformation, ..._props } = props;
    const additionalInformation = JSON.stringify({
      slackChannel,
      slackUsername,
      slackIcon,
      userInformation: _additionalInformation,
    });

    super({
      ..._props,
      additionalInformation,
    });

    this.slackProps = props;
    this.id = id;
    this.approval = approval;
    this.slackAdditionalInformation = additionalInformation;
  }

  protected bound(_scope: Construct, stage: IStage, options: ActionBindOptions): ActionConfig {
    this.approval.topic.grantPublish(options.role);
    this.approval.approverHandler.role?.addToPrincipalPolicy(
      new PolicyStatement({
        actions: ["codepipeline:PutApprovalResult"],
        resources: [`${stage.pipeline.pipelineArn}/${stage.stageName}/${this.slackProps.actionName}`],
      })
    );

    return {
      configuration: undefinedIfAllValuesAreEmpty({
        NotificationArn: this.approval.topic.topicArn,
        CustomData: this.slackAdditionalInformation,
        ExternalEntityLink: this.slackProps.externalEntityLink,
      }),
    };
  }
}

export interface SlackApprovalProps {
  readonly slackToken: string;
}

export class SlackApproval extends Construct {
  public readonly props: SlackApprovalProps;
  public readonly topic: Topic;
  public readonly approverHandler: AwsFunction;

  constructor(scope: Construct, id: string, props: SlackApprovalProps) {
    super(scope, id);

    this.props = props;

    const stack = Stack.of(scope);
    const topic = new Topic(scope, `Topic`, {});

    this.topic = topic;

    const requester = new AwsFunction(scope, `Requester`, {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset(resolve(__dirname, "requester"), {}),
      handler: "index.handler",
      environment: {
        AWS_ACCOUNT_ID: stack.account,
        SLACK_TOKEN: this.props.slackToken,
      },
    });

    topic.addSubscription(new LambdaSubscription(requester));

    const api = new HttpApi(this, "Api", {});

    const approver = new AwsFunction(this, "Approver", {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset(resolve(__dirname, "approver"), {}),
      handler: "index.handler",
      environment: {
        AWS_ACCOUNT_ID: stack.account,
        SLACK_TOKEN: this.props.slackToken,
      },
    });

    this.approverHandler = approver;

    api.addRoutes({
      path: "/{proxy+}",
      methods: [HttpMethod.ANY],
      integration: new LambdaProxyIntegration({ handler: approver }),
    });
  }

  public addApprovalAction(id: string, props: SlackApprovalActionProps) {
    const action = new SlackApprovalAction(this, id, { ...props });
    return action;
  }
}

function undefinedIfAllValuesAreEmpty(object: object): object | undefined {
  return Object.values(object).some((v) => v !== undefined) ? object : undefined;
}
