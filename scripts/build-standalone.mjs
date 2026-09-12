/** A tiny bundler for this repository's named-import ES modules. No npm dependencies.
 * Rejects unsupported import/export forms rather than silently changing their meaning.
 */
import {readFile,writeFile} from 'node:fs/promises';
import {posix} from 'node:path';
const seen=new Set(),visiting=new Set(),chunks=[];
async function visit(file){
  if(seen.has(file))return;
  if(visiting.has(file))throw new Error(`Circular dependency: ${file}`);
  visiting.add(file);let code=await readFile(file,'utf8');
  const imports=[...code.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g)];
  for(const m of imports){const target=posix.normalize(posix.join(posix.dirname(file),m[2]));await visit(target);code=code.replace(m[0],`const {${m[1]}}=__modules[${JSON.stringify(target)}];`);}
  const exports=[...code.matchAll(/\bexport\s+(?:async\s+)?(?:class|function|const|let)\s+([\w$]+)/g)].map(m=>m[1]);
  code=code.replace(/\bexport\s+(?=(?:async\s+)?(?:class|function|const|let)\s)/g,'');
  if(/^\s*(import|export)\s/m.test(code))throw new Error(`Unsupported module syntax in ${file}`);
  chunks.push(`__modules[${JSON.stringify(file)}]=(()=>{\n${code}\nreturn {${exports.join(',')}};\n})();`);
  seen.add(file);visiting.delete(file);
}
await visit('src/ui/app.js');
const css=(await readFile('src/ui/tokens.css','utf8'))+'\n'+(await readFile('src/ui/style.css','utf8')).replace(/@import[^;]+;/g,'');
const files=['data/runs/index.json','data/benchmarks/reference.json','data/runs/navigation-seed17.json','data/runs/relocation-seed17.json','data/runs/antenna-seed17.json'];
const data={};for(const path of files)data[path]=JSON.parse(await readFile(path,'utf8'));
let html=await readFile('index.html','utf8');
const icon=encodeURIComponent(await readFile('assets/ant-mark.svg','utf8'));
html=html.replaceAll('assets/ant-mark.svg',`data:image/svg+xml,${icon}`).replace('<link rel="stylesheet" href="src/ui/style.css">',`<style>${css}</style>`).replace('href="./"','href="#"');
html=html.replace('<script type="module" src="src/ui/app.js"></script>',()=>`<script>window.__ANT1_DATA__=${JSON.stringify(data).replaceAll('<','\\u003c')};</script><script>\n(()=>{'use strict';const __modules={};\n${chunks.join('\n')}\n})();\n</script>`);
await writeFile('ANT-1.html',html);console.log(`Built ANT-1.html (${seen.size} modules; reference runs embedded).`);
