import { App } from 'aws-cdk-lib';
import { MonitorStack } from '../../src/infra/stacks/MonitorStack';
import { Capture, Match, Template } from 'aws-cdk-lib/assertions';

describe('monitor stack test', ()=> {
  let monitorStackTemplate: Template;
  beforeAll(()=> {
    const testApp = new App({
      outdir: 'cdk.out',
    });
    const monitorStack = new MonitorStack(testApp, 'testMonitorStack');
    monitorStackTemplate = Template.fromStack(monitorStack);
  })

  test('lambda properties', ()=> {
    monitorStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs18.x',
    })
  })

  test('sns topic properties', ()=> {
    monitorStackTemplate.hasResourceProperties('AWS::SNS::Topic', {
      DisplayName: 'AlarmTopic',
      TopicName: 'AlarmTopic',
    })
  })

  test('sns subscriptions with matchers', ()=> {
    monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription', 
    Match.objectEquals({
      Protocol: 'lambda',
      TopicArn: {
        Ref: Match.stringLikeRegexp('AlarmTopic')
      },
      Endpoint: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('WebHookLambda'),
          'Arn',
        ]
      }
    })
  )})

  test('sns subscriptions with exact values', ()=> {
    const snsTopic = monitorStackTemplate.findResources('AWS::SNS::Topic');
    const lambda = monitorStackTemplate.findResources('AWS::Lambda::Function');
    const snsTopicName = Object.keys(snsTopic)[0];
    const lambdaName = Object.keys(lambda)[0];
    
    monitorStackTemplate.hasResourceProperties('AWS::SNS::Subscription', 
      {
       Protocol: 'lambda',
        TopicArn: {
          Ref: Match.exact(snsTopicName)
        },
        Endpoint: {
          'Fn::GetAtt': [
            Match.exact(lambdaName),
            'Arn',
          ]
        }
      }
  )})

  test('alarm actions', ()=> {
    const alarmActionsCapture = new Capture()
    monitorStackTemplate.hasResourceProperties('AWS::CloudWatch::Alarm', {
      AlarmActions: alarmActionsCapture
    })

    expect(alarmActionsCapture.asArray()).toEqual([{
      Ref: expect.stringMatching(/^AlarmTopic/)
    }])
  })

  test.only('monitor stack snapshot test', ()=> {
    expect(monitorStackTemplate.toJSON()).toMatchSnapshot();
  })
})