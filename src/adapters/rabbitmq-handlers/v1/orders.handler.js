import useCase from '../../../use-cases/orders'

export default function OrdersHandler(repositories, services) {
  const paymentSuccessful = (message) =>
    useCase.paymentSuccessful(repositories, services, message)

  return {
    paymentSuccessful
  }
}
