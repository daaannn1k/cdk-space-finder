import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb';


export async function getSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  console.log('EVENT', event);

  if(event.queryStringParameters){
    if('id' in event.queryStringParameters) {
      const spaceId = event.queryStringParameters['id'];
      const result = await ddbClient.send(new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          // @ts-ignore
          'id': {
            S: spaceId
          }
        }
      }))

      if(result.Item) {
        const unmarshalledItem = unmarshall(result.Item);
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshalledItem),
        }
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Space with id ${spaceId} not found`),
        }
      }
      
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify('Bad request! Invalid parameter')
      }
    }
  }

  const result = await ddbClient.send(new ScanCommand({
    TableName: process.env.TABLE_NAME,
    
  }));


  const unmarshalledItems = result.Items?.map(item => unmarshall(item));

  console.log('UNMARSHALLEDITEMS', unmarshalledItems);
  console.log('RESULT', result);

  return {
    statusCode: 200,
    body: JSON.stringify(unmarshalledItems),
  }
}