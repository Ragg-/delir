const { join } = require('path')

module.exports = {
  ...require('../../jest.config'),
  globals: {
    'ts-jest': {
      tsConfig: join(__dirname, 'tsconfig.test.json'),
      isolatedModules: true,
    },
  },
}
