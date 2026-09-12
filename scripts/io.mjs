import {mkdir,writeFile} from 'node:fs/promises';
import {dirname} from 'node:path';
export async function writeJSON(path,value){await mkdir(dirname(path),{recursive:true});await writeFile(path,JSON.stringify(value,null,2)+'\n');}
export function flags(argv=process.argv.slice(2)){const out={};for(let i=0;i<argv.length;i++){if(!argv[i].startsWith('--'))throw new Error(`Expected --flag, got ${argv[i]}`);const key=argv[i].slice(2);if(!argv[i+1]||argv[i+1].startsWith('--'))throw new Error(`Missing value for --${key}`);out[key]=argv[++i];}return out;}
export function number(value,fallback,name){const n=value==null?fallback:Number(value);if(!Number.isInteger(n)||n<0||n>4294967295)throw new Error(`${name} must be an unsigned 32-bit integer.`);return n;}
