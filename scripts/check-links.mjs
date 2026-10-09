import { readdir, readFile, access } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { site } from '../src/config.ts';
async function files(dir) {
  const all=await readdir(dir,{withFileTypes:true});
  return (await Promise.all(all.map(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]))).flat();
}
const pages=(await files('dist')).filter(p=>extname(p)==='.html');
const errors=[];
const ids=new Map();
for(const page of pages){const html=await readFile(page,'utf8');const found=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]); if(new Set(found).size!==found.length)errors.push(`${page}: duplicate HTML IDs`);ids.set(page,new Set(found));}
const decode=s=>s.replaceAll('&amp;','&').replaceAll('&#38;','&');
for(const page of pages){
  const html=await readFile(page,'utf8');
  for(const match of html.matchAll(/\b(?:href|src|data-pdf-src)="([^"]+)"/g)){
    const value=decode(match[1]);
    if(/^(https?:|mailto:|data:)/.test(value))continue;
    if(value.startsWith('#')){if(!ids.get(page).has(decodeURIComponent(value.slice(1))))errors.push(`${page}: missing anchor ${value}`);continue;}
    const url=new URL(value,`https://example.test/${page.replace(/^dist\//,'')}`);
    if(!url.pathname.startsWith(site.base+'/')){errors.push(`${page}: local URL missing base: ${value}`);continue;}
    let target=join('dist',decodeURIComponent(url.pathname.slice(site.base.length)));
    if(url.pathname.endsWith('/'))target=join(target,'index.html');
    try{await access(target);}catch{errors.push(`${page}: missing target ${value}`);continue;}
    if(url.hash&&ids.has(target)&&!ids.get(target).has(decodeURIComponent(url.hash.slice(1))))errors.push(`${page}: missing target anchor ${value}`);
  }
}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`Internal links, assets, anchors, and unique IDs verified across ${pages.length} HTML pages.`);
