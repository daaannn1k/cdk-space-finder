import { Amplify } from 'aws-amplify';
import { SignInOutput, fetchAuthSession, signIn } from 'aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'eu-west-1';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-west-1_QUTcajgho',
      userPoolClientId: '635q1cnrgn22857j49j3dnpqha',
      identityPoolId: 'eu-west-1:bdd5aa53-e37b-4038-8d76-b9eecc1fca3f',
    },
  }
})

export class AuthService {
  // public authSession: any;
  public async login(username: string, password: string) {
    const result = await signIn({ username, password, options: { authFlowType: 'USER_PASSWORD_AUTH' } }) as SignInOutput;
    const authSession = await fetchAuthSession();
    console.log('AUTHSESSION', authSession);
    return { result, authSession };
  }

  public async generateTemporaryCredentials(authSessionData: any) {
    // const authSession = await fetchAuthSession();
    const jwtToken = authSessionData.tokens?.idToken.toString();
    // 'http://cognito-idp.us-east-1.amazonaws.com/us-east-1_abcdefghi:app_client_id'
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/eu-west-1_QUTcajgho`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: 'eu-west-1:bdd5aa53-e37b-4038-8d76-b9eecc1fca3f',
        logins: {
          //@ts-ignore
          [cognitoIdentityPool]: jwtToken
        }
      })
    })

    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}