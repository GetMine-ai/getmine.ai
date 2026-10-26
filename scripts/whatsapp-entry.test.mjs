import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whatsappLink } from '../src/data/whatsapp.ts';
const read = path => readFileSync(new URL(`../dist/${path}`, import.meta.url),'utf8');
test('Step 1 initial HTML opens the configured WhatsApp chat without JavaScript',()=>{
 const html=read('meet-mina.html');
 assert.match(html,/id="text-mina" href="https:\/\/wa.me\//);
 assert.equal((html.match(new RegExp(whatsappLink().replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))??[]).length,2);
 assert.equal(read('meet-mina/index.html'),html);
 assert.ok(!html.includes('__WHATSAPP_LINK__'));
 assert.ok(!html.includes('existing test account'));
});
test('landing script and QR read the same generated number configuration',()=>{
 assert.ok(read('whatsapp-config.js').includes(whatsappLink().split('?')[0].split('/').at(-1)));
 assert.ok(read('meet-mina/script.js').includes('/whatsapp-config.js'));
 const sitemap=read('sitemap-0.xml');
 assert.ok(!sitemap.includes('/invite'));assert.ok(!sitemap.includes('/meet-mina'));
});
