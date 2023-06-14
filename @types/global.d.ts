import metaJson from 'meta.json'
import type { ILogObj, Logger } from 'tslog'

declare global {
  type out = Logger<any> & { log: (logObj: string | ILogObj) => void }

  const out: out

  type meta = typeof metaJson

  const meta: meta
}
