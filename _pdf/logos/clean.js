const {chromium}=require(process.env.PW);const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const [n,split] of [['vora','y'],['nidoo','x'],['nidoo-color','x'],['sym-navy','x'],['sym-grad','x']]){
 await p.setContent(fs.readFileSync(n+'.raw.svg','utf8'));
 const r=await p.evaluate(split=>{const svg=document.querySelector('svg');const ps=[...svg.querySelectorAll('path')];
  const items=ps.map(e=>{const bb=e.getBBox();const m=e.getCTM();return {d:e.getAttribute('d'),t:e.getAttribute('transform')||'',x:bb.x+(m?m.e:0),y:bb.y+(m?m.f:0),w:bb.width,h:bb.height}}).filter(i=>i.w*i.h>30&&i.w<3900);
  const X0=Math.min(...items.map(i=>i.x)),Y0=Math.min(...items.map(i=>i.y)),X1=Math.max(...items.map(i=>i.x+i.w)),Y1=Math.max(...items.map(i=>i.y+i.h));
  return {items,box:[X0,Y0,X1-X0,Y1-Y0]}},split);
 fs.writeFileSync(n+'.json',JSON.stringify(r));console.log(n,r.box.map(Math.round),r.items.length,r.items.map(i=>[Math.round(i.x),Math.round(i.y),Math.round(i.w),Math.round(i.h)]));
}
await b.close()})();
// recorte del logo de Café del Sur
(async()=>{const b=await chromium.launch();const p=await b.newPage();
for(const n of ['cafe','cafe-isotipo']){await p.goto('file://'+process.cwd()+'/'+n+'.svg');
 const bb=await p.evaluate(()=>{const s=document.querySelector('svg');s.removeAttribute('viewBox');const els=[...s.querySelectorAll('path,use,rect,polygon')].filter(e=>{const r=e.getBoundingClientRect();const f=getComputedStyle(e).fill;return r.width>0&&r.width<s.getBoundingClientRect().width*.9&&f!=='none'&&f!=='rgb(255, 255, 255)'});
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;els.forEach(e=>{const r=e.getBoundingClientRect();x0=Math.min(x0,r.left);y0=Math.min(y0,r.top);x1=Math.max(x1,r.right);y1=Math.max(y1,r.bottom)});return [x0,y0,x1-x0,y1-y0,s.getAttribute('width'),s.getAttribute('height')]});
 console.log(n,bb);fs.writeFileSync(n+'.bb.json',JSON.stringify(bb));}
await b.close()})();
