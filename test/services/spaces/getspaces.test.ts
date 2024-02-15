import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { getSpaces } from '../../../src/services/spaces/GetSpaces';


const someItems = [{
    id: {
        S: '123'
    },
    location: {
        S: 'Paris'
    }
}]


describe('Spaces handler test suite', () => {

  const ddbClient = {
    send: jest.fn()
  };

  afterEach(() => {
    jest.clearAllMocks();
  })

   test('getSpaces returns items', async () => {
     ddbClient.send.mockResolvedValue({ Items: someItems });
     const getResult = await getSpaces({ httpMethod: 'GET' } as any, ddbClient as any);
     const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify([{ id: '123', location: 'Paris'}])
    }
    
    expect(getResult).toEqual(expectedResponse);
   })

   test('getSpaces returns an error with bad parameter', async () => {
    ddbClient.send.mockResolvedValue({ Item: someItems });
    const getResult = await getSpaces({ httpMethod: 'GET', queryStringParameters: { idt: '123' } } as any, ddbClient as any);
    const expectedResponse = {
     statusCode: 400,
     body: JSON.stringify('Bad request! Invalid parameter')
   }
   
   expect(getResult).toEqual(expectedResponse);
  })

  test('getSpaces returns a message with no item found', async () => {
    ddbClient.send.mockResolvedValue({});
    const getResult = await getSpaces({ httpMethod: 'GET', queryStringParameters: { id: '1234' } } as any, ddbClient as any);
    const expectedResponse = {
     statusCode: 404,
     body: JSON.stringify('Space with id 1234 not found')
   }
   
   expect(getResult).toEqual(expectedResponse);
  })
})