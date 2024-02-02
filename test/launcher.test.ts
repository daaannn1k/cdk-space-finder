import { handler } from '../src/services/spaces/handler';

process.env.TABLE_NAME = 'SpaceStack-067a1fdf9239',
process.env.AWS_REGION = 'eu-west-1',


handler({
  httpMethod: 'POST', body: '{ "location" : "Paris-2" }',
  headers: {},
  multiValueHeaders: {},
  isBase64Encoded: false,
  path: '',
  pathParameters: null,
  queryStringParameters: {
    id: 'c73b747b-3eb6-467f-8f28-d4f30040b5c0'
  },
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: '',
    apiId: '',
    authorizer: undefined,
    protocol: '',
    httpMethod: '',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '',
      user: null,
      userAgent: null,
      userArn: null
    },
    path: '',
    stage: '',
    requestId: '',
    requestTimeEpoch: 0,
    resourceId: '',
    resourcePath: ''
  },
  resource: ''
}, {} as any)