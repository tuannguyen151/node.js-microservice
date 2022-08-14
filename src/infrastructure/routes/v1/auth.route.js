import express from 'express'
import makeCallback from './make-callback'

import authController from '../../../adapters/controllers/v1/auth.controller'
import userRepository from '../../database/mysql/repositories/user.repository'
import authService from '../../services/auth.service'

const router = express.Router()

const repositories = { userRepository }
const services = { authService }

const controller = authController(repositories, services)

router.route('/auth/login').post(makeCallback(controller.login))
router.route('/auth/verify-token').get(makeCallback(controller.verifyToken))

export default router
