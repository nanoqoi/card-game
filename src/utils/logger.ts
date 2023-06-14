import { Logger as TSLogger, type ILogObj } from 'tslog'

const logger = new TSLogger({
  name: meta.name,
  prettyLogTemplate: '[{{logLevelName}}] [{{name}}] ({{hh}}:{{MM}}:{{ss}}) ',
  prettyErrorTemplate:
    '\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}',
  prettyErrorStackTemplate:
    '  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}',
  stylePrettyLogs: true,
  prettyLogStyles: {
    logLevelName: {
      '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
      INFO: ['blueBright', 'bold'],
      ERROR: ['bold', 'red'],
      SILLY: ['bold', 'white'],
      TRACE: ['bold', 'whiteBright'],
      DEBUG: ['bold', 'green'],
      WARN: ['bold', 'yellow'],
      FATAL: ['bold', 'redBright'],
    },
    name: ['whiteBright', 'bold'],
    errorName: ['bgRed', 'whiteBright'],
  },
})

const log = (logObj: string | ILogObj) => logger.info(logObj)

const out = logger

// @ts-ignore
logger.log = log

// @ts-ignore
globalThis.out = out
