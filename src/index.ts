import JSON5 from 'json5'
import type { Plugin, JsonOptions } from 'vite'
import { dataToEsm } from '@rollup/pluginutils'

// Custom json filter for vite
const json5ExtRE = /\.(jsonc|json5)$/

export interface Json5Options extends JsonOptions {}

export function json5Plugin (
  options: Json5Options = {},
  isBuild: boolean
): Plugin {
  return {
    name: 'vite:json5',

    transform (json, id) {
      if (!json5ExtRE.test(id)) return null

      try {
        // Parse the JSON5
        const parsed = JSON5.parse(json)

        if (options.stringify === true) {
          json = JSON.stringify(parsed)

          if (isBuild) {
            return {
              // during build, parse then double-stringify to remove all
              // unnecessary whitespaces to reduce bundle size.
              code: `export default JSON.parse(${JSON.stringify(
                JSON.stringify(JSON.parse(json))
              )})`,
              map: { mappings: '' }
            }
          } else {
            return `export default JSON.parse(${JSON.stringify(json)})`
          }
        }

        return {
          code: dataToEsm(parsed, {
            preferConst: true,
            namedExports: options.namedExports
          }),
          map: { mappings: '' }
        }
      } catch (e) {
        const error = e as Error
        this.error(error.message)
      }
    }
  }
}
