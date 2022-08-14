import Model from '../models'
import { parseIncludeOption } from './common'

const { User } = Model

const includeModels = {}

const findOneBy = async (params, options = {}) => {
  const { include, ...extraOptions } = options

  const includeParsed = parseIncludeOption(includeModels, include)

  const user = await User.findOne({
    where: params,
    ...extraOptions,
    include: includeParsed
  })

  return user
}

export default {
  findOneBy
}
