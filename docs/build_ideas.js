// Minimal static generator: converts startup_ideas/*.md into site/ideas/*.html
// Usage: node site/build_ideas.js

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'startup_ideas');
const OUT = path.join(__dirname, 'ideas');
const DATA_JS = path.join(__dirname, 'index.data.js');
const OVERRIDES = path.join(__dirname, 'one_liners_override.json');

// Helpers: frontmatter + markdown preview rendering
function stripFrontMatter(md){
  if(md.startsWith('---')){
    const end = md.indexOf('\n---', 3);
    if(end !== -1) return md.slice(end+4);
  }
  return md;
}

// Markdown to HTML renderer (idea pages): supports headings, emphasis, links, code, lists, blockquotes, hr, and tables
function mdToHtml(md){
  md = stripFrontMatter(md);
  // Remove boilerplate template/version meta lines in blockquotes
  md = md.replace(/^\s*>\s*(Uses Template.*|Idea Version.*)$/gm, '');

  // Convert GitHub-style tables before paragraphizing
  function convertTables(src){
    const lines = src.split('\n');
    const out = [];
    let i=0;
    const isRow = (s)=>/\|/.test(s);
    const isDiv = (s)=>/^\s*\|?\s*:?-{3,}\s*(\|\s*:?-{3,}\s*)+\|?\s*$/.test(s);
    while(i<lines.length){
      if(i+1<lines.length && isRow(lines[i]) && isDiv(lines[i+1])){
        const header = lines[i];
        i+=2; const rows=[];
        while(i<lines.length && isRow(lines[i]) && lines[i].trim()!==''){ rows.push(lines[i]); i++; }
        const split = (r)=>r.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(c=>c.trim());
        const ths = split(header);
        let html = '<table><thead><tr>'+ths.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>';
        for(const r of rows){ const tds=split(r); html += '<tr>'+tds.map(d=>'<td>'+d+'</td>').join('')+'</tr>'; }
        html += '</tbody></table>';
        out.push(html);
        continue;
      }
      out.push(lines[i]);
      i++;
    }
    return out.join('\n');
  }

  md = convertTables(md);

  let html = md
    // code fences (```)
    .replace(/```([\s\S]*?)```/g, (_, code)=>'<pre><code>'+code.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</code></pre>')
    // headings
    .replace(/^###\s+\*\*\*(.*?)\*\*\*.*/gm, '<h3>$1</h3>')
    .replace(/^###\s+\*\*(.*?)\*\*.*/gm, '<h3>$1</h3>')
    .replace(/^###\s+(.*)/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.*)/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.*)/gm, '<h1>$1</h1>')
    // emphasis and inline code
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // lists placeholders
    .replace(/^\d+\.\s+(.*)/gm, '<oli>$1</oli>')
    .replace(/^-\s+(.*)/gm, '<uli>$1</uli>')
    // blockquotes
    .replace(/^>\s+(.*)/gm, '<blockquote>$1</blockquote>')
    // horizontal rules
    .replace(/^---$/gm, '<hr/>')
    // paragraphs
    .replace(/\n\n/gm, '</p><p>');

  html = '<p>'+html+'</p>';
  // Wrap list placeholders and unwrap block elements from paragraphs
  html = html.replace(/(?:<uli>.*?<\/uli>)+/gs, m=>'<ul>'+m.replace(/<uli>/g,'<li>').replace(/<\/uli>/g,'</li>')+'</ul>');
  html = html.replace(/(?:<oli>.*?<\/oli>)+/gs, m=>'<ol>'+m.replace(/<oli>/g,'<li>').replace(/<\/oli>/g,'</li>')+'</ol>');
  html = html.replace(/<p>\s*(<(?:ul|ol|pre|table|blockquote)[\s\S]*?<\/(?:ul|ol|pre|table|blockquote)>)\s*<\/p>/g, '$1');
  return html;
}

function layout(title, body){
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../style.css" />
  <style>.status-control{margin-left:auto}.status-control select{padding:6px 8px;border-radius:8px;border:1px solid #e5e7eb}
  @media (max-width: 520px){header{flex-wrap:wrap}.status-control{margin-left:0;width:100%}.status-control select{width:100%}}</style>
  </head><body><header style="display:flex;align-items:center;gap:12px"><a href="../index.html" style="color:white;text-decoration:none">← All ideas</a><h1 style="margin:0">${title}</h1><div class="status-control"><select id="status-select" aria-label="Approval status">
    <option>In revision</option>
    <option>Validated</option>
    <option>Needs Adjustments</option>
    <option>Closed</option>
  </select></div></header>
  <main class="container">${body}</main>
  <script src="../index.data.js"></script>
  <script>(function(){
    var title = ${JSON.stringify(title)};
    var key = 'ideaStatus:'+title;
    var select = document.getElementById('status-select');
    var initial = localStorage.getItem(key);
    if(!initial && window.IDEAS){
      var found = (window.IDEAS||[]).find(function(i){ return i.title===title; });
      if(found && found.status) initial = found.status;
    }
    if(initial === 'Need Adjusments') initial = 'Needs Adjustments';
    if(initial === 'Rejected') initial = 'Closed';
    if(!initial) initial = 'In revision';
    select.value = initial;
    select.addEventListener('change', function(){ localStorage.setItem(key, this.value); });
  })();</script>
  </body></html>`;
}

function ensureDir(p){ if(!fs.existsSync(p)) fs.mkdirSync(p, {recursive:true}); }

function stripFrontMatter(md){
  if(md.startsWith('---')){
    const end = md.indexOf('\n---', 3);
    if(end !== -1) return md.slice(end+4);
  }
  return md;
}
function clean(s){
  return s.replace(/^\s+|\s+$/g,'').replace(/^"|\"|\'|\*+/g,'').replace(/\*+$/,'');
}
function looksLikeProblem(s){
  return /problem|❌/i.test(s);
}
function extractOneLiner(md){
  md = stripFrontMatter(md);
  // 1) Tagline in italics on its own line
  const italic = md.match(/^\s*\*([^*].{5,120}?)\*\s*$/m);
  if (italic && !looksLikeProblem(italic[1])) return clean(italic[1]);
  // 2) H3 tagline (***text*** or **text** or plain) not about problem
  const h3 = md.match(/^###\s+(?:\*\*\*|\*\*)?([^*#\n].{5,120}?)(?:\*\*\*|\*\*)?\s*$/m);
  if (h3 && !looksLikeProblem(h3[1])) return clean(h3[1]);
  // 3) First short sentence after a title
  const lines = md.split(/\n/).slice(0,60);
  let sawTitle = false;
  for(const line of lines){
    if(/^#{1,3}\s+/.test(line)){ sawTitle = true; continue; }
    if(!sawTitle) continue;
    const l = line.trim();
    if(!l || /^---$/.test(l) || /^###/.test(l) || /^>/.test(l) || /^\*/.test(l) && l.length<4) continue;
    if(looksLikeProblem(l)) continue;
    if(l.length<=120 && !/:$/.test(l)) return clean(l);
  }
  return 'Click to read more';
}

function main(){
  ensureDir(OUT);
  const files = fs.readdirSync(SRC).filter(f=>f.endsWith('.md'));
  // write site CSS (purple theme + tables)
  fs.writeFileSync(path.join(__dirname,'style.css'), `body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;background:#faf7ff;color:#1a102b}
  header{padding:28px 20px;background:#5B21B6;color:white}
  h1{margin:8px 0 0}
  .container{max-width:940px;margin:20px auto;padding:0 16px}
  h2,h3{margin-top:24px}
  ul,ol{padding-left:24px}
  code{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:2px 4px}
  pre{background:#0b1021;color:#e5e7eb;padding:12px;border-radius:8px;overflow:auto}
  table{width:100%;border-collapse:collapse;margin:16px 0;background:white}
  th,td{border:1px solid #e5e7eb;padding:8px;text-align:left}
  thead th{background:#f3f4f6}
  blockquote{border-left:4px solid #e5e7eb;padding:6px 12px;color:#4b5563;background:#fafafa;border-radius:6px}
  `);

  const index = [];
  const overrides = fs.existsSync(OVERRIDES) ? JSON.parse(fs.readFileSync(OVERRIDES,'utf8')) : {};
  for(const file of files){
    const title = path.basename(file, '.md');
    const md = fs.readFileSync(path.join(SRC, file), 'utf8');
    const auto = extractOneLiner(md);
    const body = mdToHtml(md);
    const raw = overrides[title];
    let one = auto; let stat = ''; let display = title; let rank = 999;
    if (raw){
      if (typeof raw === 'string') { one = raw; }
      else { one = raw.one || raw.one_liner || auto; stat = raw.stat || ''; display = raw.display_title || title; rank = (raw.rank!=null)? raw.rank : rank; }
    }
    // Force all ideas to show as In revision for the site view now
    const status = 'In revision';
    const html = layout(display, body);
    fs.writeFileSync(path.join(OUT, title+'.html'), html);
    index.push({ title: display, slug: title, one_liner: one, stat, status, rank });
  }
  // data for index.html (works from file://)
  fs.writeFileSync(DATA_JS, 'window.IDEAS = ' + JSON.stringify(index, null, 2) + ';\n');
  // write site CSS (purple theme + tables)
  fs.writeFileSync(path.join(__dirname,'style.css'), `body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:0;background:#faf7ff;color:#1a102b}
  header{padding:28px 20px;background:#5B21B6;color:white}
  h1{margin:8px 0 0}
  .container{max-width:940px;margin:20px auto;padding:0 16px}
  h2,h3{margin-top:24px}
  ul,ol{padding-left:24px}
  code{background:#f3f4f6;border:1px solid #e5e7eb;border-radius:6px;padding:2px 4px}
  pre{background:#0b1021;color:#e5e7eb;padding:12px;border-radius:8px;overflow:auto}
  table{width:100%;border-collapse:collapse;margin:16px 0;background:white}
  th,td{border:1px solid #e5e7eb;padding:8px;text-align:left}
  thead th{background:#f3f4f6}
  blockquote{border-left:4px solid #e5e7eb;padding:6px 12px;color:#4b5563;background:#fafafa;border-radius:6px}
  `);
  console.log('Built site/ideas/*.html and index.data.js');
}

if (require.main === module) main();

