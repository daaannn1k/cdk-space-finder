import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { putSpaces } from './PutSpaces';
import { deleteSpaces } from './DeleteSpace';
import { JsonError, MissingFieldError } from '../shared/Validator';

const ddbClient = new DynamoDBClient({});

async function handler (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let message: string = '';

  try {
    if(event.httpMethod === 'GET') {
      const getResponse = await getSpaces(event, ddbClient);
      return getResponse;
    } else if (event.httpMethod === 'POST') {
      const postResponse = await postSpaces(event, ddbClient);
      return postResponse;
    } else if (event.httpMethod === 'PUT') {
      const putResponse = await putSpaces(event, ddbClient);
      return putResponse;
    }
      else if (event.httpMethod === 'DELETE') {
      const deleteResponse = await deleteSpaces(event, ddbClient);
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
  return response;
}

export { handler };