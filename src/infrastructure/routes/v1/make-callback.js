import logger from '../../../logger'

export default (controller) => (req, res) => {
  const userBase64 = req.header('user')

  const user = userBase64
    ? JSON.parse(Buffer.from(userBase64, 'base64').toString('utf-8'))
    : null

  const httpRequest = {
    body: req.body,
    query: req.query,
    params: req.params,
    ip: req.ip,
    method: req.method,
    path: req.path,
    user,
    logger: req.logger,
    files: req.files,
    file: req.file,
    source: {
      ip: req.ip,
      browser: req.get('User-Agent')
    },
    headers: {
      token: req.header('Authorization'),
      'Content-Type': req.get('Content-Type'),
      Referer: req.get('referer'),
      'User-Agent': req.get('User-Agent')
    }
  }

  controller(httpRequest)
    .then((data) => {
      res.set('Content-Type', 'application/json')
      res.type('json')
      const body = {
        success: true,
        code: 200,
        data
      }
      res.status(200).send(body)
    })
    .catch((e) => {
      let statusCode = e.statusCode || 500
      let { message } = e
      let type = e.type || 'SERVER_ERROR'

      if (e.errors) {
        statusCode = 422
        type = e.errors[0].message
        message = `${e.errors[0].path} ${e.errors[0].validatorKey}`
      }

      res.status(statusCode).send({
        success: false,
        code: statusCode,
        error: {
          type,
          description: message
        }
      })

      if (statusCode === 500) logger.error(req, e)
    })
}
