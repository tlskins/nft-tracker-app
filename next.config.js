module.exports = (phase, { defaultConfig }) => {
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
      /* config options here */
      apiHost: "https://v4mps60z1i.execute-api.us-east-1.amazonaws.com/dev",
    }
    return nextConfig
  }