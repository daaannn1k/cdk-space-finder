import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Alarm, Metric, Unit } from 'aws-cdk-lib/aws-cloudwatch';
import { SnsAction } from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';
import { getStackSuffix } from '../Utils';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';




export class MonitorStack extends Stack {
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
  
    const stackSuffix = getStackSuffix(this);
    
    const webHookLambda = new NodejsFunction(this, 'WebHookLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', 'services', 'monitor', 'handler.ts'),
    })

    const alarmTopic = new Topic(this, 'AlarmTopic', {
      displayName: 'AlarmTopic',
      topicName: 'AlarmTopic',
    });

    alarmTopic.addSubscription(new LambdaSubscription(webHookLambda));

    const spaceApi4xxAlarm = new Alarm(this, 'spaceApi4xxAlarm', {
      threshold: 5,
      evaluationPeriods: 1,
      metric: new Metric({
        namespace: 'AWS/ApiGateway',
        metricName: '4XXError',
        period: Duration.minutes(1),
        statistic: 'Sum',
        unit: Unit.COUNT,
        dimensionsMap: {
          'ApiName': 'SpacesApi',
        },
      }),
      alarmName: 'SpaceApi4xxAlarm',
    });

    spaceApi4xxAlarm.addAlarmAction(new SnsAction(alarmTopic));
    spaceApi4xxAlarm.addOkAction(new SnsAction(alarmTopic));
    
  }


}