import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LambdaStack } from './stacks/LambdaStack';
import { ApiStack } from './stacks/ApiStack';
import { AuthStack } from './stacks/AuthStack';
import { UIDeploymentStack } from './stacks/UIDeploymentStack';
import { MonitorStack } from './stacks/MonitorStack';

const app = new App();

const dataStack = new DataStack(app, 'DataStack');
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  spacesStable: dataStack.spacesTable
});
const authStack = new AuthStack(app, 'AuthStack', {
  photosBucket: dataStack.photosBucket,
})
const apiStack = new ApiStack(app, 'ApiStack', {
  spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration, 
  userPool: authStack.userPool
});

const deploymentUiStack = new UIDeploymentStack(app, 'UIDeploymentStack');
const monitorStack = new MonitorStack(app, 'MonitorStack');