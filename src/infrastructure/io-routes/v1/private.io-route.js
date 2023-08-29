import privateGateway from '../../../adapters/gateways/v1/private.gateway'

export default (io) => {
  const privateNamespace = io.of('/v1/private')

  privateGateway(privateNamespace)

  return privateNamespace
}
