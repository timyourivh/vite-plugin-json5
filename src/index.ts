import JSON5 from 'json5'
import type { Plugin } from 'vite'
import { dataToEsm } from '@rollup/pluginutils'
const fileRegex = /\.(jsonc|json5)$/

export interface Json5Options {
  /**
   * Generate a named export for every property of the JSON object
   * @default true
   */
  namedExports?: boolean
  /**
   * Generate performant output as JSON.parse('stringified').
   * Enabling this will disable namedExports.
   * @default false
   */
  stringify?: boolean
}

export default function json5Plugin(
  options: Json5Options = {},
  isBuild: boolean
): Plugin {
  return {
    name: 'vite:parse-json5',

    async transform (code: string, id: string) {
      if (fileRegex.test(id)) {
        if (options.stringify) {
          return {
            // during build, parse then double-stringify to remove all
            // unnecessary whitespaces to reduce bundle size.
            code: `export default JSON.parse(${JSON.stringify(
              JSON.stringify(JSON5.parse(code))
            )})`,
            map: { mappings: '' },
          }
        }

        try {
          const parsed = JSON5.parse(code)
          return {
            code: dataToEsm(parsed, {
              preferConst: true,
              namedExports: options.namedExports,
            }),
            map: { mappings: '' },
          }
        } catch (e) {
          this.error(`Failed to parse JSON file.`)
        }
      }
      return null;
    }
  }
}
