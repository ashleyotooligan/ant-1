import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const root=fileURLToPath(new URL('../',import.meta.url));
const ignore=new Set(['node_modules','output','.git','__pycache__']);
async function walk(dir){let out=[];for(const entry of await readdir(dir,{withFileTypes:true})){if(ignore.has(entry.name))continue;const p=resolve(dir,entry.name);out.push(...(entry.isDirectory()?await walk(p):[p]));}return out;}
const files=await walk(root),errors=[];
for(const file of files){
  if(file.endsWith('.md')){const text=await readFile(file,'utf8');for(const m of text.matchAll(/\]\(([^)\s]+)\)/g)){const ref=m[1].split('#')[0];if(!ref||/^[a-z]+:/i.test(ref))continue;try{await stat(resolve(dirname(file),ref));}catch{errors.push(`${relative(root,file)} -> missing ${ref}`);}}}
  if(file.endsWith('.json')){try{JSON.parse(await readFile(file,'utf8'));}catch{errors.push(`Invalid JSON: ${file}`);}}
}
const html=await readFile(resolve(root,'ANT-1.html'),'utf8');
for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))try{new Script(m[1]);}catch(e){errors.push(`Standalone JavaScript syntax: ${e.message}`);}
if(html.includes('type="module"')||html.includes('@import'))errors.push('Standalone file has an unresolved script or style import.');
for(const required of ['README.md','LICENSE','src/core/simulation.js','assets/figures/observation.png','assets/figures/neural-interface.png','assets/figures/controls.png','assets/figures/market-interface.png','assets/figures/observation-loop.gif','data/benchmarks/reference.json'])try{await stat(resolve(root,required));}catch{errors.push(`Missing required asset: ${required}`);}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Verified ${files.length} repository files: Markdown targets, JSON records, required figures and standalone JavaScript syntax.`);
