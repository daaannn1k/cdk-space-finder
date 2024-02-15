import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { putSpaces } from './PutSpaces';
import { deleteSpaces } from './DeleteSpace';
import { JsonError, MissingFieldError } from '../shared/Validator';
import { addCorsHeader } from '../shared/Utils';
import { captureAWSv3Client } from 'aws-xray-sdk-core';

const ddbClient = captureAWSv3Client(new DynamoDBClient({}));

async function handler (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let message: string = '';
  
  try {
    if(event.httpMethod === 'GET') {
      const getResponse = await getSpaces(event, ddbClient);
      addCorsHeader(getResponse);
      return getResponse;
    } else if (event.httpMethod === 'POST') {
      const postResponse = await postSpaces(event, ddbClient);
      addCorsHeader(postResponse);
      return postResponse;
    } else if (event.httpMethod === 'PUT') {
      const putResponse = await putSpaces(event, ddbClient);
      addCorsHeader(putResponse);
      return putResponse;
    } else if (event.httpMethod === 'DELETE') {
      const deleteResponse = await deleteSpaces(event, ddbClient);
      addCorsHeader(deleteResponse);
      return deleteResponse;
    }
  } catch (error) {
    console.log('ERROR:,', error)

    if(error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message)
      }
    }
    if(error instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message)
      }
    }
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message)
  }
  addCorsHeader(response);
  return response;
}

export { handler };