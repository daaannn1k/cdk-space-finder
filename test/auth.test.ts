import { fetchAuthSession } from '@aws-amplify/auth';
import { AuthService } from './AuthService';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';


async function testAuth () {
  const service = new AuthService();
  const login = await service.login('vladislav', '132501Vv&13');
  const authSession = await fetchAuthSession();
  
  console.log('LOGIN:', authSession.tokens?.idToken?.toString());
  // console.log('authSession', authSession.tokens?.idToken?.toString())
  const credentials = await service.generateTemporaryCredentials(authSession);
  console.log('CREDENTIALS: ', credentials);
  // const bucketList = await listBuckets(credentials);
  // console.log('BUCKETLIST', bucketList);
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();