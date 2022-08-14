import authUseCase from '../../../use-cases/auth'

export default (repositories, services) => {
  const login = (httpRequest) =>
    authUseCase.login(repositories, services, httpRequest)

  const verifyToken = (httpRequest) =>
    authUseCase.verifyToken(repositories, services, httpRequest)

  return {
    login,
    verifyToken
  }
}
