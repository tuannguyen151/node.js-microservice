import config from '../../config'

const { createCommonError } = config

export default async (
  { userRepository },
  { authService },
  { headers: { token } }
) => {
  if (!token)
    throw createCommonError({
      statusCode: 401,
      type: 'TOKEN_NOT_FOUND',
      message: 'Token not found'
    })

  if (token.split(' ')[0] !== 'Bearer')
    throw createCommonError({
      statusCode: 401,
      type: 'TOKEN_INVALID_FORMAT',
      message: 'Token invalid format'
    })

  try {
    const userDecoded = authService.verify(token.split(' ')[1])

    const user = await userRepository.findOneBy(
      {
        id: userDecoded.id
      },
      {
        attributes: {
          exclude: [
            'password',
            'reset_password_token',
            'reset_password_sent_at',
            'deleted_at'
          ]
        }
      }
    )

    return user
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      throw createCommonError({
        statusCode: 401,
        type: 'TOKEN_EXPIRED',
        message: 'Token has expired'
      })

    throw createCommonError({
      statusCode: 401,
      type: 'TOKEN_INVALID',
      message: 'Token invalid'
    })
  }
}
