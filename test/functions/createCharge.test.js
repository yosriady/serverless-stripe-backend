const LambdaTester = require('lambda-tester');
const nock = require('nock');

const createCharge = require('../../functions/createCharge');

const testJsonBody = '{"token":{"id":"tok_1AXRROEFsRbbjUA2h7qgz1nD","object":"token","card":{"id":"card_1AXRROEFsRbbjUA2qznZttIr","object":"card","address_city":null,"address_country":null,"address_line1":null,"address_line1_check":null,"address_line2":null,"address_state":null,"address_zip":null,"address_zip_check":null,"brand":"Visa","country":"US","cvc_check":"pass","dynamic_last4":null,"exp_month":12,"exp_year":2020,"funding":"credit","last4":"4242","metadata":{},"name":"test@email.com","tokenization_method":null},"client_ip":"103.224.167.33","created":1498123050,"email":"test@email.com","livemode":false,"type":"card","used":false},"charge":{"amount":200,"currency":"USD"}}';
const testEvent = {
  body: testJsonBody
};

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

describe('createCharge', () => {
  describe('success cases', () => {
    beforeEach(() => {
      nock('https://api.stripe.com/v1')
          .post('/charges')
          .reply(200, { success: true });
    });

    test('returns response', () => {
      return LambdaTester(createCharge.handler)
			.event(testEvent)
			.expectResult((data) => {
        expect(data).toMatchSnapshot();
      });
    });
  });

  describe('error cases', () => {
    beforeEach(() => {
      nock('https://api.stripe.com/v1')
          .post('/charges')
          .reply(500);
    });

    test('returns response', () => {
      return LambdaTester(createCharge.handler)
      .event(testEvent)
      .expectResult((data) => {
        expect(data).toMatchSnapshot();
      });
    });
  });
});
