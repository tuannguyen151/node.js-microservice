/**
 * Parses include options for Sequelize query.
 *
 * @param {Object} includeModels - The include models object.
 *     An object where the keys represent the names of the include options,
 *     and the values can be either a model or an object with the following properties:
 *         - model: The main model for the include option.
 *         - include: (Optional) An object representing nested include options.
 * @param {Array} include - The include options array.
 *     An array of objects where each object represents an include option with the following properties:
 *         - name: The name of the include option (corresponds to a key in includeModels).
 *         - include: (Optional) An array of nested include options for the current include option.
 *         - ...other properties: Additional properties specific to the include option.
 * @returns An array of Sequelize include options.
 */
export const parseIncludeOption = (includeModels, include = []) => {
  if (!include.length) return undefined

  return include.reduce((result, includeItem) => {
    const {
      name,
      attributes,
      through,
      include: subInclude,
      ...includeProps
    } = includeItem
    const includeModel = includeModels[name]

    if (includeModel) {
      const processedIncludeItem = {
        model: includeModel.model || includeModel,
        as: name,
        attributes,
        through: through ? { attributes: through.attributes || [] } : undefined,
        ...includeProps
      }

      if (subInclude) {
        processedIncludeItem.include = parseIncludeOption(
          includeModel.include,
          subInclude
        )
      }

      result.push(processedIncludeItem)
    }

    return result
  }, [])
}

export const paginate = (page, pageSize) => {
  const pageInt = parseInt(page, 10)
  const pageSizeInt = parseInt(pageSize, 10)

  if (!pageInt || !pageSizeInt || pageInt < 1 || pageSizeInt < 1) return {}

  return {
    offset: (pageInt - 1) * pageSizeInt,
    limit: pageSizeInt
  }
}
