import JSON5 from 'json5'
import type { Plugin } from 'vite'
import { dataToEsm } from "@rollup/pluginutils";
const fileRegex = /\.(jsonc|json5)$/

export default function json5Plugin (): Plugin {
  return {
    name: 'vite:parse-json5',

    async transform (code: string, id: string) {
      if (fileRegex.test(id)) {
        try {
          const parsed = JSON5.parse(json);
          return {
            code: dataToEsm(parsed, {
              preferConst: true,
              namedExports: options.namedExports,
            }),
            map: { mappings: "" },
          };
        } catch (e) {
          this.error(`Failed to parse JSON file.`);
        }
      }
      return null;
    }
  }
}
