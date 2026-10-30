const {chromium}=require(process.env.PW);(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1300,height:900},deviceScaleFactor:2});
await p.goto('http://localhost:8794/_pdf/mock/sb.html',{waitUntil:'networkidle'});
for(const id of ['marv-fan','marv-two','rata-fan','rata-two','ng-fan','ng-two'])await (await p.$('#'+id)).screenshot({path:'mock/'+id+'.png',omitBackground:true});await b.close()})();
