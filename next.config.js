module.exports = {
  reactStrictMode: true,
  env: {
    STYTCH_PUBLIC_TOKEN: process.env.STYTCH_PUBLIC_TOKEN,
    IRON_SESSION_PWD: process.env.IRON_SESSION_PWD,
    COOKIE_NAME: process.env.COOKIE_NAME,
    STYTCH_PROJECT_ENV: process.env.STYTCH_PROJECT_ENV,
    FAUNA_SECRET: process.env.FAUNA_SECRET,
    FAUNA_SERVER_KEY: process.env.FAUNA_SERVER_KEY,
  },
};
