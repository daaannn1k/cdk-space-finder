import { Stack, StackProps } from 'aws-cdk-lib'
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { IUserPool, UserPool } from 'aws-cdk-lib/aws-cognito'
import { Construct } from 'constructs'

interface ApiStackProps extends StackProps {
  spacesLambdaIntegration: LambdaIntegration,
  userPool: IUserPool,
}

export class ApiStack extends Stack {

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const api = new RestApi(this, 'SpacesApi');
  
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', { cognitoUserPools: [props.userPool], identitySource: 'method.request.header.Authorization'});

    authorizer._attachToApi(api);
    
    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      }
    }

    const optionsWithCors: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowMethods: Cors.ALL_METHODS,
        allowOrigins: Cors.ALL_ORIGINS,
      }
    }
    const spacesResources = api.root.addResource('spaces', optionsWithCors);
    spacesResources.addMethod('GET', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod('POST', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod('PUT', props.spacesLambdaIntegration, optionsWithAuth);
    spacesResources.addMethod('DELETE', props.spacesLambdaIntegration, optionsWithAuth);
  }
}