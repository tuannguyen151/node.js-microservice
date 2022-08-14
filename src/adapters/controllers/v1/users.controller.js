import usersUseCase from '../../../use-cases/users'

export default () => {
  const profile = (httpRequest) => usersUseCase.profile(httpRequest)

  return {
    profile
  }
}
