// Minimal static generator: converts startup_ideas/*.md into site/ideas/*.html
// Usage: node site/build_ideas.js

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'startup_ideas');
const OUT = path.join(__dirname, 'ideas');
const DATA_JS = path.join(__dirname, 'index.data.js');

// Tiny markdown to HTML: handles headings, paragraphs, lists, code fences minimally
function mdToHtml(md){
  let html = md
    .replace(/^###\s+\*\*\*(.*?)\*\*\*.*/gm, '<h3>$1</h3>')
    .replace(/^###\s+\*\*(.*?)\*\*.*/gm, '<h3>$1</h3>')
    .replace(/^###\s+(.*)/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)/gm, '<h1>$1</h1>')
    .replace(/^-\s+(.*)/gm, '<li>$1</li>')
    .replace(/\n\n/gm, '</p><p>');
  html = '<p>'+html+'</p>';
  html = html.replace(/<li>(.*?)<\/li>/gs, '<ul><li>$1</li></ul>');
  return html;
}

function layout(title, body){
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link rel="stylesheet" href="../style.css" />
  </head><body><header><a href="../index.html" style="color:white;text-decoration:none">← All ideas</a><h1>${title}</h1></header>
  <main class="container">${body}</main>
  </body></html>`;
}

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, {recursive:true}); }

function extractOneLiner(md){
  const triple = md.match(/^###\s+\*\*\*(.*?)\*\*\*.*/m);
  if (triple) return triple[1].trim();
  const bold = md.match(/^###\s+\*\*(.*?)\*\*.*/m);
  if (bold) return bold[1].trim();
  const plain = md.match(/^###\s+(.*)/m);
  if (plain) return plain[1].trim();
  return 'Click to read more';
}

function main(){
  ensureDir(OUT);
  const files = fs.readdirSync(SRC).filter(f=>f.endsWith('.md'));
  const index = [];
  for(const file of files){
    const title = path.basename(file, '.md');
    const md = fs.readFileSync(path.join(SRC, file), 'utf8');
    const body = mdToHtml(md);
    const html = layout(title, body);
    fs.writeFileSync(path.join(OUT, title+'.html'), html);
    index.push({ title, slug: title, one_liner: extractOneLiner(md) });
  }
  // data for index.html (works from file://)
  fs.writeFileSync(DATA_JS, 'window.IDEAS = ' + JSON.stringify(index, null, 2) + ';\n');
  // write a tiny CSS
  fs.writeFileSync(path.join(__dirname,'style.css'), `body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;background:#f7faf9;color:#1f2937}
  header{padding:24px 20px;background:#0f766e;color:white}
  h1{margin:8px 0 0}
  .container{max-width:860px;margin:20px auto;padding:0 16px}
  h2,h3{margin-top:24px}
  ul{padding-left:20px}
  `);
  console.log('Built site/ideas/*.html and index.data.js');
}

if (require.main === module) main();

