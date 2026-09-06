const PW='/tmp/claude-1000/-media-yousofkortam-Eng--Kortam-Graduation-Project-xjudge-web/3afb71f4-b2b8-4806-8e2e-5bd7c7ff44ed/scratchpad/pw/node_modules/playwright-core';
const { chromium } = require(PW);
const fs=require('fs');
const OUT=process.env.SHOT_DIR || '/tmp/claude-1000/-media-yousofkortam-Eng--Kortam-Graduation-Project-xjudge-web/3afb71f4-b2b8-4806-8e2e-5bd7c7ff44ed/scratchpad/shots';
fs.mkdirSync(OUT,{recursive:true});
const BASE='http://127.0.0.1:4200';
const CREDS={userHandle:'xjudge',userPassword:'XjudgeLocal2026'};

(async () => {
  const b = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const ctx = await b.newContext({viewport:{width:1440,height:960}});
  const page = await ctx.newPage();
  let errors=[], net=[];
  page.on('pageerror', e=>errors.push('PAGEERROR: '+e.message.slice(0,300)));
  page.on('console', m=>{ if(m.type()==='error') errors.push('CONSOLE: '+m.text().slice(0,300)); });
  page.on('response', r=>{ const u=r.url(); if(r.status()>=400 && !u.includes('favicon')) net.push(r.status()+' '+u.replace(BASE,'').slice(0,110)); });

  const report=[];
  const visit = async (label, url, shot) => {
    errors=[]; net=[];
    await page.goto(BASE+url,{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(2200);
    const text = await page.evaluate(()=>document.body.innerText);
    if (shot) await page.screenshot({path:`${OUT}/${shot}.png`, fullPage:false});
    report.push({label, requested:url, landed:page.url().replace(BASE,''), chars:text.length,
                 head:text.replace(/\s+/g,' ').slice(0,150), errors:[...errors], net:[...net]});
  };

  // --- signed out
  for (const [l,u,s] of [['home','/','out-home'],['login','/login','out-login'],['register','/register','out-register'],
                          ['problems','/problem','out-problems'],['contests','/contest','out-contests'],
                          ['status','/status','out-status'],['groups','/group',null],['404','/definitely-not-a-route',null]])
    await visit('signed-out '+l, u, s);

  // --- login
  errors=[]; net=[];
  await page.goto(BASE+'/login',{waitUntil:'domcontentloaded'});
  await page.locator('#userHandle').fill(CREDS.userHandle);
  await page.locator('#userPassword').fill(CREDS.userPassword);
  await page.locator('button[type=submit]').click();
  await page.waitForTimeout(3000);
  const token = await page.evaluate(()=>localStorage.getItem('userToken'));
  report.push({label:'LOGIN', landed:page.url().replace(BASE,''),
               tokenParts: token ? token.split('.').length : 0,
               tokenSample: token ? token.slice(0,18)+'…' : String(token),
               errors:[...errors], net:[...net]});

  // --- signed in
  for (const [l,u,s] of [['home','/home','in-home'],['problems','/problem','in-problems'],
                          ['contests','/contest','in-contests'],['status','/status','in-status'],
                          ['profile','/profile/'+CREDS.userHandle,'in-profile'],
                          ['groups','/group','in-groups'],['invitations','/group/invitations',null],
                          ['changePassword','/changePassword',null]])
    await visit('signed-in '+l, u, s);

  // --- responsive
  for (const [name,w,h] of [['mobile',390,844],['tablet',834,1112]]) {
    await page.setViewportSize({width:w,height:h});
    await visit(`${name} home`, '/home', `${name}-home`);
    await visit(`${name} problems`, '/problem', `${name}-problems`);
  }

  fs.writeFileSync(OUT+'/smoke.json', JSON.stringify(report,null,2));
  for (const r of report) {
    const bad = (r.errors?.length||0)+(r.net?.length||0);
    console.log(`${bad?'⚠':'✓'} ${r.label.padEnd(24)} → ${(r.landed||'').padEnd(26)} chars=${String(r.chars??'-').padEnd(6)} ${r.tokenParts!==undefined?'tokenParts='+r.tokenParts+' '+r.tokenSample:''}`);
    (r.errors||[]).slice(0,2).forEach(e=>console.log('     '+e));
    (r.net||[]).slice(0,4).forEach(e=>console.log('     NET '+e));
    if(r.head) console.log('     "'+r.head.slice(0,110)+'"');
  }
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
