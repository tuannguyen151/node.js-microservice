/* eslint-disable camelcase */

import Joi from 'joi'
import config from '../config'

const { createCommonError } = config

const STATUS_ENUM = {
  inactive: 0,
  active: 1
}

const ROLE_ENUM = {
  admin: 1,
  user: 2
}

const userJoiSchema = Joi.object({
  id: Joi.number(),

  first_name: Joi.string().required().max(50),
  last_name: Joi.string().required().max(50),
  username: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9_]+$/)
    .max(50),
  email: Joi.string().allow(null, '').email(),

  phone: Joi.string()
    .allow(null, '')
    .pattern(/^((\+)84|0)[1-9](\d{2}){4}$/),
  role: Joi.number()
    .required()
    .valid(...Object.values(ROLE_ENUM)),
  password: Joi.string().required().max(255),
  email_verified_at: Joi.date(),

  phone_verified_at: Joi.date(),

  reset_password_token: Joi.string().max(255),
  reset_password_sent_at: Joi.date(),

  status: Joi.number()
    .required()
    .valid(...Object.values(STATUS_ENUM)),
  created_at: Joi.date(),
  updated_at: Joi.date(),
  deleted_at: Joi.date()
})

export default class UserEntity {
  constructor({
    id,
    first_name,
    last_name,
    username,
    email,
    phone,
    password,
    email_verified_at,
    phone_verified_at,
    reset_password_token,
    reset_password_sent_at,
    status,
    created_at,
    updated_at,
    deleted_at
  }) {
    this.id = id
    this.first_name = first_name
    this.last_name = last_name
    this.username = username
    this.email = email
    this.phone = phone
    this.password = password
    this.email_verified_at = email_verified_at
    this.phone_verified_at = phone_verified_at
    this.reset_password_token = reset_password_token
    this.reset_password_sent_at = reset_password_sent_at
    this.status = status
    this.created_at = created_at
    this.updated_at = updated_at
    this.deleted_at = deleted_at

    this.validate()
  }

  validate() {
    const result = userJoiSchema.validate(this)

    if (result.error)
      throw createCommonError({
        type: result.error.details[0].type.toUpperCase(0),
        message: result.error.details[0].message
      })
  }
}
