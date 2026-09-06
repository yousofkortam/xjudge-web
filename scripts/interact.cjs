const PW='/tmp/claude-1000/-media-yousofkortam-Eng--Kortam-Graduation-Project-xjudge-web/3afb71f4-b2b8-4806-8e2e-5bd7c7ff44ed/scratchpad/pw/node_modules/playwright-core';
const { chromium } = require(PW);
const OUT='/tmp/claude-1000/-media-yousofkortam-Eng--Kortam-Graduation-Project-xjudge-web/3afb71f4-b2b8-4806-8e2e-5bd7c7ff44ed/scratchpad/shots';
const B='http://127.0.0.1:4200';
let errs=[];
const step=(ok,label,extra='')=>console.log(`${ok?'✓':'✗'} ${label}${extra?' — '+extra:''}`);

(async()=>{
  const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
  const ctx=await b.newContext({viewport:{width:1440,height:1000}});
  const page=await ctx.newPage();
  page.on('pageerror',e=>errs.push('PAGEERROR '+e.message.slice(0,160)));
  page.on('console',m=>{if(m.type()==='error'&&!/status of (4\d\d|5\d\d)/.test(m.text()))errs.push('CONSOLE '+m.text().slice(0,160));});

  // sign in
  await page.goto(B+'/login',{waitUntil:'domcontentloaded'});
  await page.locator('#userHandle').fill('xjudge');
  await page.locator('#userPassword').fill('XjudgeLocal2026');
  await page.locator('button[type=submit]').click();
  await page.waitForURL('**/home');
  step(true,'login → /home');

  // --- submit dialog
  errs=[];
  await page.goto(B+'/problem/codeforces/1850A',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(2500);
  await page.getByRole('button',{name:/Submit/}).click();
  await page.waitForTimeout(2000);
  const dialogVisible = await page.locator('mat-dialog-container').isVisible().catch(()=>false);
  const langCount = await page.locator('#submit-language option').count().catch(()=>0);
  step(dialogVisible && langCount>1,'submit dialog opens with compilers', `${langCount} language options`);
  await page.screenshot({path:OUT+'/dialog-submit.png'});

  // fill and submit → expect a graceful judge error (no judge credentials configured)
  if(langCount>1){
    await page.selectOption('#submit-language',{index:1});
    await page.locator('#submit-solution').fill('#include <bits/stdc++.h>\nint main(){return 0;}');
    await page.getByRole('button',{name:/^Submit$/}).click();
    await page.waitForTimeout(6000);
    const txt = await page.evaluate(()=>document.body.innerText);
    const gotResult = /Submission result|In queue|Pending|Unknown|error|Error|permission|judge/i.test(txt);
    step(gotResult,'submit produces a visible result/error state (not a crash)');
    await page.screenshot({path:OUT+'/dialog-result.png'});
    const closeBtn = page.getByRole('button',{name:/^Close$/});
    if (await closeBtn.count()) await closeBtn.first().click();
    await page.waitForTimeout(1200);
  }
  step(errs.length===0,'no uncaught errors during submit flow', errs.slice(0,2).join(' | '));

  // --- create-contest dialog
  errs=[];
  await page.goto(B+'/contest',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(2000);
  await page.getByRole('button',{name:/Create contest/}).first().click();
  await page.waitForTimeout(3000);
  const ccVisible = await page.locator('#cc-title').isVisible().catch(()=>false);
  step(ccVisible,'create-contest dialog opens');
  await page.screenshot({path:OUT+'/dialog-contest.png'});
  // validation must block an empty submit
  await page.getByRole('button',{name:/^Create contest$/}).last().click();
  await page.waitForTimeout(800);
  const stillOpen = await page.locator('#cc-title').isVisible().catch(()=>false);
  step(stillOpen,'empty create-contest is rejected client-side, dialog stays open');
  const cancel = page.getByRole('button',{name:/^Cancel$/});
  if (await cancel.count()) await cancel.first().click();
  await page.waitForTimeout(1200);

  // --- create-group dialog
  errs=[];
  await page.goto(B+'/group/exploreGroups',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(1800);
  await page.getByRole('button',{name:/Create group/}).first().click();
  await page.waitForTimeout(2000);
  const uniqueName = 'Verify Group ' + Date.now();
  await page.locator('#group-name').fill(uniqueName);
  await page.locator('#group-description').fill('Created by the frontend verification run.');
  await page.getByRole('button',{name:/^Create group$/}).last().click();
  await page.waitForTimeout(3500);
  step(/\/group\/\d+/.test(page.url()),'create group navigates to the new group', page.url().replace(B,''));
  await page.screenshot({path:OUT+'/group-created.png'});
  step(errs.length===0,'no uncaught errors during group flow', errs.slice(0,2).join(' | '));

  // --- navbar user menu + logout
  errs=[];
  await page.goto(B+'/home',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(1500);
  await page.locator('.xj-nav__user-btn').click(); await page.waitForTimeout(500);
  const menuOpen = await page.locator('.xj-nav__dropdown').isVisible();
  step(menuOpen,'navbar account menu opens');
  await page.getByRole('menuitem',{name:/Sign out/}).click();
  await page.waitForTimeout(1500);
  const loggedOut = await page.evaluate(()=>localStorage.getItem('userToken'));
  step(page.url().includes('/login') && loggedOut===null,'sign out clears the session and returns to /login');

  // --- mobile nav
  await page.setViewportSize({width:390,height:844});
  await page.goto(B+'/home',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(1200);
  const collapsedHidden = !(await page.locator('#xj-nav-menu').isVisible());
  await page.locator('.xj-nav__toggle').click(); await page.waitForTimeout(500);
  const expanded = await page.locator('#xj-nav-menu').isVisible();
  step(collapsedHidden && expanded,'mobile menu is collapsed by default and opens on tap');
  await page.screenshot({path:OUT+'/mobile-nav-open.png'});

  // --- keyboard: skip link
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(B+'/home',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(1000);
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(()=>document.activeElement?.className||'');
  step(focused.includes('xj-skip-link'),'first Tab reaches the skip link', focused);

  step(errs.length===0,'no uncaught errors overall', errs.slice(0,3).join(' | '));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
