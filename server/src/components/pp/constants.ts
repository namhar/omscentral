import { appConfig } from '../../config';

const e = encodeURIComponent;

const message = {
  success: e('Purchase completed, thank you.'),
  cancel: e('Checkout canceled.'),
};

const { clientUrl } = appConfig;

export const successUrl = `${clientUrl}/courses?session_id={CHECKOUT_SESSION_ID}&tv=success&tm=${message.success}`;

export const cancelUrl = `${clientUrl}/pricing?tv=info&tm=${message.cancel}`;
