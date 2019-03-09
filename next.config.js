module.exports = {
  pageExtensions: ["js", "jsx", "tsx"],
  webpack: (config, { dir, defaultLoaders }) => {
    config.resolve.extensions.push(".ts", ".tsx")

    config.module.rules.push({
      test: /\.tsx?$/,
      include: [dir],
      exclude: /node_modules/,
      use: [
        defaultLoaders.babel,
        {
          loader: "ts-loader"
        }
      ]
    })

    return config
  }
}
