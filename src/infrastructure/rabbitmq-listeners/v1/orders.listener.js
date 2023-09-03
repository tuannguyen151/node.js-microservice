import OrdersHandler from '../../../adapters/rabbitmq-handlers/v1/orders.handler'

const repositories = {}
const services = {}

const handler = OrdersHandler(repositories, services)

export default [
  {
    queue: 'payment-successful-order',
    handler: handler.paymentSuccessful
  }
]
