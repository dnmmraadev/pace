import {test, expect} from '@playwright/test';
import {PROFILE_KEY} from '../src/lib/profile';
import {STORAGE_KEY} from '../src/lib/progress';
import {emptyProgress} from '../src/lib/learning';
import {lessons} from '../src/data/curriculum';
import {capstoneChecks} from '../src/data/scenarios';

test.use({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const runtimeErrors=new WeakMap<import('@playwright/test').Page,string[]>();
test.beforeEach(({page})=>{const errors:string[]=[];runtimeErrors.set(page,errors);page.on('pageerror',error=>errors.push(error.message));});
test.afterEach(({page})=>{expect(runtimeErrors.get(page)).toEqual([]);});
const noOverflow = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('main')).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBeTruthy();
};

test('mobile onboarding, learning, review, navigation, search and context', async({page})=>{
  await page.goto('http://127.0.0.1:5173');
  const dialog=page.getByRole('dialog');
  await expect(dialog).toContainText('Bienvenido a PACE');
  await page.getByLabel('Nombre o nombre preferido').fill('María');
  await page.screenshot({path:'test-results/mobile-onboarding.png'});
  await dialog.getByRole('button',{name:'Continuar',exact:true}).click();
  await dialog.getByRole('button',{name:'Entrar a PACE'}).click();
  await noOverflow(page);
  await page.screenshot({path:'test-results/mobile-today.png'});
  await page.getByRole('button',{name:'Continuar sesión',exact:true}).click();
  await page.getByRole('button',{name:'Empezar práctica',exact:true}).click();
  await page.getByPlaceholder('Escribe tu respuesta').fill('0');
  await page.getByRole('button',{name:'Comprobar respuesta',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('cola de repaso');
  await noOverflow(page);
  await page.screenshot({path:'test-results/mobile-lesson.png'});
  await page.getByRole('button',{name:'Abrir contexto',exact:true}).click();
  await expect(dialog).toContainText('Referencia de la lección');
  await page.screenshot({path:'test-results/mobile-context.png'});
  await dialog.getByRole('button',{name:'Cerrar diálogo'}).click();
  await page.getByRole('button',{name:'Abrir navegación'}).click();
  await expect(dialog.getByRole('navigation')).toBeVisible();
  await page.screenshot({path:'test-results/mobile-navigation.png'});
  await dialog.getByRole('button',{name:'Cola de repaso',exact:true}).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Refuerza los conceptos que te cuestan'})).toBeVisible();
  await page.getByRole('button',{name:'Abrir búsqueda'}).click();
  await dialog.getByLabel('Buscar en PACE').fill('ADR');
  await expect(dialog.getByRole('button',{name:/ADR/}).first()).toBeVisible();
  await dialog.getByRole('button',{name:/ADR/}).first().click();
  await expect(dialog).toHaveCount(0);
  await page.reload();
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).attempts.length,STORAGE_KEY)).toBe(1);
  expect(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!).name,PROFILE_KEY)).toBe('María');
});

test('narrow layouts, local commands, tables, CSV, dialogs and language switching', async({page})=>{
  await page.addInitScript(key=>localStorage.setItem(key,JSON.stringify({version:1,name:'Ana',role:'',goal:'',onboardingComplete:true})),PROFILE_KEY);
  await page.goto('http://127.0.0.1:5173');
  await page.getByLabel('Comando local').fill('/practice');
  await page.getByLabel('Comando local').press('Enter');
  const table=page.locator('.table-scroll').first();
  expect(await table.evaluate(el=>el.scrollWidth>el.clientWidth)).toBeTruthy();
  await table.evaluate(el=>el.scrollLeft=el.scrollWidth);
  expect(await table.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Exportar CSV',exact:true}).click();
  expect((await download).suggestedFilename()).toBe('synthetic-forward-dates.csv');
  await page.getByRole('button',{name:'Cambiar a modo oscuro'}).click();
  await page.getByRole('combobox',{name:'Idioma',exact:true}).selectOption('en');
  for(const [width,height] of [[320,740],[390,844],[768,1024],[844,390]]){
    await page.setViewportSize({width,height});
    await noOverflow(page);
    await expect(page.getByRole('button',{name:'Open navigation'})).toBeVisible();
    await page.screenshot({path:`test-results/mobile-practice-${width}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByLabel('Local command').fill('/formula');
  await page.getByLabel('Local command').press('Enter');
  await expect(page.getByRole('dialog')).toContainText('RevPAR');
  await page.screenshot({path:'test-results/mobile-formulas.png'});
  await page.getByRole('dialog').getByRole('button',{name:'Close dialog'}).click();
});

test('canonical logo renders identically in both themes and desktop remains available', async({page})=>{
  await page.addInitScript(key=>localStorage.setItem(key,JSON.stringify({version:1,name:'',role:'',goal:'',onboardingComplete:true})),PROFILE_KEY);
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('http://127.0.0.1:5173');
  const logo=page.locator('.app>.left-rail .brand-logo');
  await expect(logo).toBeVisible();
  const sample=async(element:typeof logo)=>{const box=(await element.boundingBox())!;return page.screenshot({clip:{x:box.x+5,y:box.y+5,width:box.width-10,height:box.height-10}});};
  const original=await sample(logo);
  await page.getByRole('button',{name:'Cambiar a modo oscuro'}).click();
  await expect(logo).toHaveCSS('filter','none');
  expect((await sample(logo)).equals(original)).toBeTruthy();
  await page.screenshot({path:'test-results/desktop-canonical-logo-dark.png'});
  await page.setViewportSize({width:390,height:844});
  const compactLogo=page.locator('.mobile-brand-logo');
  const dark=await sample(compactLogo);
  await page.getByRole('button',{name:'Cambiar a modo claro'}).click();
  expect((await sample(compactLogo)).equals(dark)).toBeTruthy();
});

test('mobile curriculum, progress, capstone, interview and Excel remain reachable',async({page})=>{
  await page.addInitScript(({profile,key,value})=>{
    localStorage.setItem(profile,JSON.stringify({version:1,name:'Ana',role:'',goal:'',onboardingComplete:true}));
    localStorage.setItem(key,JSON.stringify(value));
  },{profile:PROFILE_KEY,key:STORAGE_KEY,value:{...emptyProgress(),completed:lessons.map(l=>l.id),capstone:{answers:Object.fromEntries(capstoneChecks.map(q=>[q.id,String(q.answer)])),insights:'Synthetic training report',submitted:1,score:0}}});
  await page.goto('http://127.0.0.1:5173');
  for(const name of ['Ruta de aprendizaje','Progreso','Laboratorio de entrevistas','Laboratorio de práctica']){
    await page.getByRole('button',{name:'Abrir navegación'}).click();
    await page.getByRole('dialog').getByRole('button',{name,exact:true}).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('main h1')).toBeVisible();
    await noOverflow(page);
    if(name==='Progreso')await page.screenshot({path:'test-results/mobile-progress.png'});
  }
  await page.getByRole('tab',{name:'Análisis en Excel',exact:true}).click();
  await page.locator('main').getByRole('combobox').selectOption('Direct');
  await page.getByLabel('Crear resumen por canal tipo tabla dinámica').check();
  await noOverflow(page);
  await page.screenshot({path:'test-results/mobile-excel.png'});
  await page.getByLabel('Comando local').fill('/next');
  await page.getByLabel('Comando local').press('Enter');
  await page.getByRole('button',{name:'Abrir navegación'}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Progreso',exact:true}).click();
  await page.getByRole('button',{name:'Abrir caso integrador',exact:true}).click();
  await noOverflow(page);
  await page.screenshot({path:'test-results/mobile-capstone.png'});
});
