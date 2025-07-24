/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  // },
  // ... 其他配置
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ?
      { exclude: ['error', 'warn'] } : false
  }
}

module.exports = nextConfig