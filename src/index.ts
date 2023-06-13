import JSON5 from 'json5'
import type { Plugin } from 'vite'
const fileRegex = /\.(jsonc|json5)$/

export default function json5Plugin (): Plugin {
  return {
    name: 'vite:parse-json5',

    async transform (code: string, id: string) {
      if (fileRegex.test(id)) {
        return {
          code: `const data = ${JSON.stringify(JSON5.parse(code))};\nexport default data;`,
          map: { mappings: '' }
        }
      }
      return null;
    }
  }
}
