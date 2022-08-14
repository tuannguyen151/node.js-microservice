import { Op } from 'sequelize'
import config from '../../config'

const { createCommonError } = config

const loginParams = (params) => {
  const { account, password } = params.body

  if (account && password) return { account, password }

  throw createCommonError({
    type: 'ACCOUNT_PASSWORD_REQUIRED',
    message: 'Account and Password is not allowed to be empty'
  })
}

const findUser = async (userRepository, account) => {
  const user = await userRepository.findOneBy({
    [Op.or]: [{ email: account }, { username: account }, { phone: account }]
  })

  if (!user)
    throw createCommonError({
      type: 'ACCOUNT_NOT_FOUND',
      message: 'Email, phone or username not found'
    })

  return user
}

export default async ({ userRepository }, { authService }, { body }) => {
  const params = loginParams({ body })

  const user = await findUser(userRepository, params.account)

  const isMatch = authService.compare(params.password, user.password)
  if (!isMatch)
    throw createCommonError({
      type: 'PASSWORD_INCORRECT',
      message: 'Password incorrect'
    })

  const token = authService.generateToken({
    id: user.id
  })

  return { token }
}
