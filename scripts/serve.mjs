import {createServer} from 'node:http';
import {readFile,stat,realpath} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,relative,extname} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),port=Number(process.env.ANT1_PORT||8000);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.gif':'image/gif','.md':'text/plain','.csv':'text/csv'};
createServer(async(req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end();}
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(pathname.split('/').some(s=>s.startsWith('.')))throw new Error('Hidden path');
    const file=await realpath(resolve(root,`.${pathname==='/'?'/index.html':pathname}`));
    if(relative(root,file).startsWith('..')||!(await stat(file)).isFile())throw new Error('Not found');
    const data=await readFile(file);res.writeHead(200,{'Content-Type':`${types[extname(file)]||'application/octet-stream'}; charset=utf-8`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`ANT-1 ready: http://127.0.0.1:${port}\nCtrl+C stops the laboratory.`)).on('error',error=>{console.error(error.message);process.exitCode=1;});
