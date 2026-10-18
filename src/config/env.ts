/** Single place for environment knobs so tests never hard-code the host. */
export const BASE_URL =
  process.env.BASE_URL?.replace(/\/$/, '') ?? 'https://automationexercise.com';
