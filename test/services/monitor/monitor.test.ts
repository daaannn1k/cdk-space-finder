import { handler } from '../../../src/services/monitor/handler'




describe('monitor lambda tests', () => {

  const fetchSpy = jest.spyOn(global, 'fetch');
  fetchSpy.mockImplementation(() => Promise.resolve({} as any));

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('makes requests for records in SnsEvents', async ()=> {
    await handler({
      Records: [{
        Sns: {
          Message: 'Test message',
        }
      }]
    } as any, {})

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      body: JSON.stringify({"text": `Houston, We have a problem Test message`}) 
    })
  })

  test('no sns records, no requests', async ()=> {
    await handler({
      Records: []
    } as any, {})

    expect(fetchSpy).toHaveBeenCalledTimes(0);
  })
})