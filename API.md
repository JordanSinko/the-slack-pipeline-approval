# API Reference

**Classes**

Name|Description
----|-----------
[SlackApproval](#jordansinko-the-slack-pipeline-approval-slackapproval)|*No description*
[SlackApprovalAction](#jordansinko-the-slack-pipeline-approval-slackapprovalaction)|*No description*


**Structs**

Name|Description
----|-----------
[SlackApprovalActionProps](#jordansinko-the-slack-pipeline-approval-slackapprovalactionprops)|*No description*
[SlackApprovalProps](#jordansinko-the-slack-pipeline-approval-slackapprovalprops)|*No description*



## class SlackApproval  <a id="jordansinko-the-slack-pipeline-approval-slackapproval"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new SlackApproval(scope: Construct, id: string, props: SlackApprovalProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SlackApprovalProps](#jordansinko-the-slack-pipeline-approval-slackapprovalprops)</code>)  *No description*
  * **slackToken** (<code>string</code>)  *No description* 



### Properties


Name | Type | Description 
-----|------|-------------
**approverHandler** | <code>[Function](#aws-cdk-aws-lambda-function)</code> | <span></span>
**props** | <code>[SlackApprovalProps](#jordansinko-the-slack-pipeline-approval-slackapprovalprops)</code> | <span></span>
**topic** | <code>[Topic](#aws-cdk-aws-sns-topic)</code> | <span></span>

### Methods


#### addApprovalAction(id, props) <a id="jordansinko-the-slack-pipeline-approval-slackapproval-addapprovalaction"></a>



```ts
addApprovalAction(id: string, props: SlackApprovalActionProps): SlackApprovalAction
```

* **id** (<code>string</code>)  *No description*
* **props** (<code>[SlackApprovalActionProps](#jordansinko-the-slack-pipeline-approval-slackapprovalactionprops)</code>)  *No description*
  * **actionName** (<code>string</code>)  The physical, human-readable name of the Action. 
  * **runOrder** (<code>number</code>)  The runOrder property for this Action. __*Default*__: 1
  * **variablesNamespace** (<code>string</code>)  The name of the namespace to use for variables emitted by this action. __*Default*__: a name will be generated, based on the stage and action names, if any of the action's variables were referenced - otherwise, no namespace will be set
  * **role** (<code>[IRole](#aws-cdk-aws-iam-irole)</code>)  The Role in which context's this Action will be executing in. __*Default*__: a new Role will be generated
  * **additionalInformation** (<code>string</code>)  Any additional information that you want to include in the notification email message. __*Optional*__
  * **externalEntityLink** (<code>string</code>)  URL you want to provide to the reviewer as part of the approval request. __*Default*__: the approval request will not have an external link
  * **notificationTopic** (<code>[ITopic](#aws-cdk-aws-sns-itopic)</code>)  Optional SNS topic to send notifications to when an approval is pending. __*Optional*__
  * **notifyEmails** (<code>Array<string></code>)  A list of email addresses to subscribe to notifications when this Action is pending approval. __*Optional*__
  * **slackChannel** (<code>string</code>)  *No description* 
  * **slackIcon** (<code>string</code>)  *No description* __*Optional*__
  * **slackUsername** (<code>string</code>)  *No description* __*Optional*__

__Returns__:
* <code>[SlackApprovalAction](#jordansinko-the-slack-pipeline-approval-slackapprovalaction)</code>



## class SlackApprovalAction  <a id="jordansinko-the-slack-pipeline-approval-slackapprovalaction"></a>



__Implements__: [IAction](#aws-cdk-aws-codepipeline-iaction)
__Extends__: [ManualApprovalAction](#aws-cdk-aws-codepipeline-actions-manualapprovalaction)

### Initializer




```ts
new SlackApprovalAction(approval: SlackApproval, id: string, props: SlackApprovalActionProps)
```

* **approval** (<code>[SlackApproval](#jordansinko-the-slack-pipeline-approval-slackapproval)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SlackApprovalActionProps](#jordansinko-the-slack-pipeline-approval-slackapprovalactionprops)</code>)  *No description*
  * **actionName** (<code>string</code>)  The physical, human-readable name of the Action. 
  * **runOrder** (<code>number</code>)  The runOrder property for this Action. __*Default*__: 1
  * **variablesNamespace** (<code>string</code>)  The name of the namespace to use for variables emitted by this action. __*Default*__: a name will be generated, based on the stage and action names, if any of the action's variables were referenced - otherwise, no namespace will be set
  * **role** (<code>[IRole](#aws-cdk-aws-iam-irole)</code>)  The Role in which context's this Action will be executing in. __*Default*__: a new Role will be generated
  * **additionalInformation** (<code>string</code>)  Any additional information that you want to include in the notification email message. __*Optional*__
  * **externalEntityLink** (<code>string</code>)  URL you want to provide to the reviewer as part of the approval request. __*Default*__: the approval request will not have an external link
  * **notificationTopic** (<code>[ITopic](#aws-cdk-aws-sns-itopic)</code>)  Optional SNS topic to send notifications to when an approval is pending. __*Optional*__
  * **notifyEmails** (<code>Array<string></code>)  A list of email addresses to subscribe to notifications when this Action is pending approval. __*Optional*__
  * **slackChannel** (<code>string</code>)  *No description* 
  * **slackIcon** (<code>string</code>)  *No description* __*Optional*__
  * **slackUsername** (<code>string</code>)  *No description* __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**approval** | <code>[SlackApproval](#jordansinko-the-slack-pipeline-approval-slackapproval)</code> | <span></span>
**id** | <code>string</code> | <span></span>
**slackProps** | <code>[SlackApprovalActionProps](#jordansinko-the-slack-pipeline-approval-slackapprovalactionprops)</code> | <span></span>
**slackAdditionalInformation**? | <code>string</code> | __*Optional*__

### Methods


#### protected bound(_scope, stage, options) <a id="jordansinko-the-slack-pipeline-approval-slackapprovalaction-bound"></a>

The method called when an Action is attached to a Pipeline.

This method is guaranteed to be called only once for each Action instance.

```ts
protected bound(_scope: Construct, stage: IStage, options: ActionBindOptions): ActionConfig
```

* **_scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **stage** (<code>[IStage](#aws-cdk-aws-codepipeline-istage)</code>)  *No description*
* **options** (<code>[ActionBindOptions](#aws-cdk-aws-codepipeline-actionbindoptions)</code>)  *No description*
  * **bucket** (<code>[IBucket](#aws-cdk-aws-s3-ibucket)</code>)  *No description* 
  * **role** (<code>[IRole](#aws-cdk-aws-iam-irole)</code>)  *No description* 

__Returns__:
* <code>[ActionConfig](#aws-cdk-aws-codepipeline-actionconfig)</code>



## struct SlackApprovalActionProps  <a id="jordansinko-the-slack-pipeline-approval-slackapprovalactionprops"></a>






Name | Type | Description 
-----|------|-------------
**actionName** | <code>string</code> | The physical, human-readable name of the Action.
**slackChannel** | <code>string</code> | <span></span>
**additionalInformation**? | <code>string</code> | Any additional information that you want to include in the notification email message.<br/>__*Optional*__
**externalEntityLink**? | <code>string</code> | URL you want to provide to the reviewer as part of the approval request.<br/>__*Default*__: the approval request will not have an external link
**notificationTopic**? | <code>[ITopic](#aws-cdk-aws-sns-itopic)</code> | Optional SNS topic to send notifications to when an approval is pending.<br/>__*Optional*__
**notifyEmails**? | <code>Array<string></code> | A list of email addresses to subscribe to notifications when this Action is pending approval.<br/>__*Optional*__
**role**? | <code>[IRole](#aws-cdk-aws-iam-irole)</code> | The Role in which context's this Action will be executing in.<br/>__*Default*__: a new Role will be generated
**runOrder**? | <code>number</code> | The runOrder property for this Action.<br/>__*Default*__: 1
**slackIcon**? | <code>string</code> | __*Optional*__
**slackUsername**? | <code>string</code> | __*Optional*__
**variablesNamespace**? | <code>string</code> | The name of the namespace to use for variables emitted by this action.<br/>__*Default*__: a name will be generated, based on the stage and action names, if any of the action's variables were referenced - otherwise, no namespace will be set



## struct SlackApprovalProps  <a id="jordansinko-the-slack-pipeline-approval-slackapprovalprops"></a>






Name | Type | Description 
-----|------|-------------
**slackToken** | <code>string</code> | <span></span>



