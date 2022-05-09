import Joi from 'joi';

import { AuthProvider } from '../../enums';

export const schema = Joi.object().keys({
  id: Joi.string().required(),

  auth_provider: Joi.string()
    .valid(...Object.values(AuthProvider))
    .required(),
  email: Joi.string().allow(null),
  name: Joi.string().allow(null),
  photo_url: Joi.string().allow(null),
  last_signed_in: Joi.number(),

  program_id: Joi.string().allow(null),
  specialization_id: Joi.string().allow(null),
});
