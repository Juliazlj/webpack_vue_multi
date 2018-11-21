module.exports = {
  plugins: [
    require('autoprefixer')({
      'browsers': ['Android >= 2.1', 'iOS >= 4'],
      'cascade': true,
    }),
    require('postcss-px2rem')({remUnit: 75, remPrecision: 2})
  ]
};
