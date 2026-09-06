const PW='/tmp/claude-1000/-media-yousofkortam-Eng--Kortam-Graduation-Project-xjudge-web/3afb71f4-b2b8-4806-8e2e-5bd7c7ff44ed/scratchpad/pw/node_modules/playwright-core';
const { chromium } = require(PW);
const fs=require('fs');
const OUT='/tmp/claude-1000/-media-yousofkortam-Eng--Kortam-Graduation-Project-xjudge-web/3afb71f4-b2b8-4806-8e2e-5bd7c7ff44ed/scratchpad/shots';
fs.mkdirSync(OUT,{recursive:true});
const BASE='http://127.0.0.1:4200';
(async()=>{
  const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const ctx=await b.newContext({viewport:{width:1440,height:1000}});
  const page=await ctx.newPage();
  const errs=[];
  page.on('pageerror',e=>errs.push('PAGEERROR '+e.message.slice(0,200)));
  page.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text().slice(0,200));});
  await page.goto(BASE+'/login',{waitUntil:'domcontentloaded'});
  await page.locator('#userHandle').fill('xjudge');
  await page.locator('#userPassword').fill('XjudgeLocal2026');
  await page.locator('button[type=submit]').click();
  await page.waitForURL('**/home'); await page.waitForTimeout(1800);
  const shots=[['/home','full-home'],['/problem','full-problems'],['/contest','full-contests'],
               ['/group/exploreGroups','full-groups'],['/problem/codeforces/1850A','full-problem-detail'],
               ['/status','full-status'],['/contest/2','full-contest-detail'],['/group/1','full-group-detail']];
  for(const [u,name] of shots){
    errs.length=0;
    await page.goto(BASE+u,{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(2600);
    await page.screenshot({path:`${OUT}/${name}.png`});
    const t=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,190));
    console.log(`${errs.length?'⚠':'✓'} ${u.padEnd(28)} ${t}`);
    errs.slice(0,3).forEach(e=>console.log('    '+e));
  }
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
