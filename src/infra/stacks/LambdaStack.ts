import { Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';


interface LambdaStackProps extends StackProps {
  spacesStable: ITable;
}

export class LambdaStack extends Stack {
  public readonly spacesLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);  
    
    const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts'),
      environment: {
        TABLE_NAME: props.spacesStable.tableName
      }
    });

    spacesLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'dynamodb:PutItem',
        'dynamodb:Scan',
        'dynamodb:GetItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
      ],
      resources: [
        props.spacesStable.tableArn
      ]
    }))

    this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
  }
}

// import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
// lambdaFn.addToRolePolicy(new PolicyStatement({
    //   effect: Effect.ALLOW,
    //   actions: [
    //     's3:ListAllMyBuckets',
    //     's3:ListBucket',
    //   ],
    //   resources: ['*'] //bad practice
    // }))