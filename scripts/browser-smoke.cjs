const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  const report = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  let errors = []; let failures = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) failures.push({url:r.url(), status:r.status()}); });
  const base = process.env.FRONTEND_URL || 'http://127.0.0.1:4200';
  await page.goto(base); await page.waitForTimeout(500);
  await page.evaluate(() => localStorage.setItem('userToken', 'undefined'));
  await page.reload(); await page.waitForTimeout(600);
  report.push({ check: 'invalid token startup', url: page.url(), visible: (await page.locator('body').innerText()).length > 100, cleared: await page.evaluate(() => localStorage.getItem('userToken') === null), errors, failures });
  errors=[];failures=[];
  const credentials=JSON.parse(fs.readFileSync('/tmp/xjudge-frontend-verification/credentials.json','utf8'));
  await page.goto(base+'/login');
  await page.locator('#userHandle').fill(credentials.userHandle);
  await page.locator('#userPassword').fill(credentials.userPassword);
  await page.locator('button[type=submit]').click();
  await page.waitForURL('**/home');
  report.push({check:'real backend login', session:await page.evaluate(()=>localStorage.getItem('userToken')?.split('.').length===3),errors,failures});
  for (const route of ['/','/problem','/contest','/status','/profile','/group','/group/exploreGroups','/group/invitations','/create-group','/not-a-route']) {
    errors=[];failures=[];
    await page.goto(base+route); await page.waitForTimeout(1500);
    report.push({route,url:page.url(),text:(await page.locator('body').innerText()).slice(0,900),errors,failures});
  }
  fs.writeFileSync('artifacts/verification/browser-smoke.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
