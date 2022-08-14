import express from 'express'
import makeCallback from './make-callback'

import usersController from '../../../adapters/controllers/v1/users.controller'

const router = express.Router()

const repositories = {}
const services = {}

const controller = usersController(repositories, services)

router.route('/profile').get(makeCallback(controller.profile))

export default router
