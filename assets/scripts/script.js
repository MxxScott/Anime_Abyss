// ── Cursor ────────────────────────────────────────────────
const $cursor = document.getElementById('cursor');
const $ring   = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function tick(){
    $cursor.style.left=mx+'px'; $cursor.style.top=my+'px';
    rx+=(mx-rx)*.13; ry+=(my-ry)*.13;
    $ring.style.left=rx+'px'; $ring.style.top=ry+'px';
    requestAnimationFrame(tick);
})();
function addHover(el){
    el.addEventListener('mouseenter',()=>{$ring.style.width='58px';$ring.style.height='58px';$ring.style.opacity='1';$ring.style.borderColor='var(--neon)';});
    el.addEventListener('mouseleave',()=>{$ring.style.width='36px';$ring.style.height='36px';$ring.style.opacity='.6';$ring.style.borderColor='var(--glow)';});
}
document.querySelectorAll('nav a,.btn-primary,.btn-outline,.nl-btn').forEach(addHover);

// ── Starfield ─────────────────────────────────────────────
const cvs=document.getElementById('starfield'),ctx=cvs.getContext('2d');
let stars=[];
function initStars(){
    cvs.width=window.innerWidth;cvs.height=window.innerHeight;
    stars=Array.from({length:200},()=>({x:Math.random()*cvs.width,y:Math.random()*cvs.height,r:Math.random()*1.4+.2,o:Math.random()*.5+.1,s:Math.random()*.3+.05,t:Math.random()*Math.PI*2}));
}
function drawStars(){
    ctx.clearRect(0,0,cvs.width,cvs.height);
    stars.forEach(s=>{s.t+=s.s*.02;const o=s.o*(.5+.5*Math.sin(s.t));ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(240,171,252,${o})`;ctx.fill();});
    requestAnimationFrame(drawStars);
}
initStars();drawStars();
window.addEventListener('resize',initStars);

// ── Jikan fetch with rate-limit retry ────────────────────
const JIKAN='https://api.jikan.moe/v4';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function jFetch(url,tries=3){
    for(let i=0;i<tries;i++){
    try{
        const r=await fetch(url);
        if(r.status===429){await wait(1500*(i+1));continue;}
        if(!r.ok) throw new Error('HTTP '+r.status);
        return await r.json();
    }catch(e){if(i===tries-1)throw e;await wait(800*(i+1));}
    }
}

// ── Marquee ───────────────────────────────────────────────
const titles=['Fullmetal Alchemist: Brotherhood','Attack on Titan','Neon Genesis Evangelion','Death Note','Cowboy Bebop','Steins;Gate','One Piece','Bleach TYBW','Jujutsu Kaisen','Demon Slayer','Hunter x Hunter','Vinland Saga','Frieren','Solo Leveling','Dungeon Meshi','Mushoku Tensei'];
const mt=document.getElementById('marquee-track');
mt.innerHTML=[...titles,...titles].map(t=>`<span class="marquee-item">${t}<span class="marquee-dot">✦</span></span>`).join('');

// ── Trending ──────────────────────────────────────────────
async function loadTrending(){
    const wrap=document.getElementById('trending-wrap');
    try{
    const d=await jFetch(`${JIKAN}/top/anime?limit=12&type=tv`);
    const items=d.data||[];
    const grid=document.createElement('div');
    grid.className='anime-grid';
    items.forEach((a,i)=>{
        const genre=a.genres?.[0]?.name||a.demographics?.[0]?.name||'Anime';
        const score=a.score?a.score.toFixed(1):'N/A';
        const img=a.images?.webp?.large_image_url||a.images?.jpg?.large_image_url||'';
        const card=document.createElement('div');
        card.className='anime-card';
        card.innerHTML=`<img src="${img}" alt="${a.title}" loading="lazy">
        <div class="card-grad"></div><div class="card-glow"></div>
        <div class="card-body">
            <div class="card-rank">#${String(i+1).padStart(2,'0')}</div>
            <div class="card-title">${a.title_english||a.title}</div>
            <div class="card-meta">
            <span class="card-score">★ ${score}</span>
            <span class="card-genre">${genre}</span>
            </div>
        </div>`;
        grid.appendChild(card);
        addHover(card);
    });
    wrap.innerHTML='';wrap.appendChild(grid);
    }catch(e){
    wrap.innerHTML=`<div class="api-error"><span class="err-icon">⚠</span>Could not load trending anime. <a href="https://myanimelist.net/topanime.php" target="_blank" style="color:var(--neon)">View on MyAnimeList →</a></div>`;
    }
}

// ── Featured ──────────────────────────────────────────────
async function loadFeatured(){
    const wrap=document.getElementById('featured-wrap');
    // Iconic IDs: FMA:B, Death Note, Cowboy Bebop, Steins;Gate, One Piece
    const ids=[5114,1535,23,9253,21];
    try{
    const results=[];
    for(const id of ids){
        try{const d=await jFetch(`${JIKAN}/anime/${id}`);if(d.data)results.push(d.data);}catch(e){}
        await wait(400);
    }
    if(results.length<2)throw new Error('too few');
    const grid=document.createElement('div');
    grid.className='featured-grid';
    results.forEach((a,i)=>{
        const div=document.createElement('div');
        div.className=`feat-card ${i===0?'feat-main':'feat-small'}`;
        const img=a.images?.webp?.large_image_url||a.images?.jpg?.large_image_url||'';
        const score=a.score?'★ '+a.score.toFixed(1):(a.genres?.[0]?.name||'Anime');
        const synopsis=(a.synopsis||'').replace(/\[Written.*?\]/g,'').trim();
        div.innerHTML=`<img src="${img}" alt="${a.title}" loading="lazy">
        <div class="feat-overlay"></div>
        <div class="feat-content">
            <span class="feat-tag">${score}</span>
            <div class="feat-title">${a.title_english||a.title}</div>
            <p class="feat-desc">${synopsis}</p>
            ${i===0?`<div class="feat-actions">
            <a href="${a.url}" target="_blank" class="btn-sm btn-sm-p">View on MAL</a>
            <a href="#" class="btn-sm btn-sm-g">Add to List</a>
            </div>`:''}
        </div>`;
        grid.appendChild(div);
        addHover(div);
    });
    wrap.innerHTML='';wrap.appendChild(grid);
    }catch(e){
    wrap.innerHTML=`<div class="api-error"><span class="err-icon">⚠</span>Could not load featured titles.</div>`;
    }
}

// ── Genres ────────────────────────────────────────────────
const genreData=[
    {icon:'⚔️',name:'Action',count:'1,842',color:'rgba(239,68,68,.2)'},
    {icon:'✨',name:'Fantasy',count:'2,104',color:'rgba(124,58,237,.2)'},
    {icon:'💀',name:'Horror',count:'412',color:'rgba(15,3,40,.5)'},
    {icon:'❤️',name:'Romance',count:'1,234',color:'rgba(236,72,153,.2)'},
    {icon:'🔬',name:'Sci-Fi',count:'876',color:'rgba(6,182,212,.2)'},
    {icon:'😂',name:'Comedy',count:'1,560',color:'rgba(234,179,8,.2)'},
    {icon:'🏫',name:'School',count:'723',color:'rgba(34,197,94,.2)'},
    {icon:'🎌',name:'Mecha',count:'445',color:'rgba(249,115,22,.2)'},
    {icon:'🌙',name:'Isekai',count:'1,089',color:'rgba(168,85,247,.2)'},
    {icon:'🥷',name:'Martial Arts',count:'331',color:'rgba(239,68,68,.15)'},
];
const gg=document.getElementById('genres-grid');
genreData.forEach(g=>{
    const el=document.createElement('div');
    el.className='genre-card';el.style.setProperty('--gc',g.color);
    el.innerHTML=`<span class="genre-icon">${g.icon}</span><div class="genre-name">${g.name}</div><div class="genre-count">${g.count} titles</div>`;
    gg.appendChild(el);addHover(el);
});

// ── Seasonal ──────────────────────────────────────────────
let seasonalData=[];
async function loadSeasonal(){
    const wrap=document.getElementById('seasonal-wrap');
    const heading=document.getElementById('season-heading');
    try{
    const now=new Date();
    const yr=now.getFullYear();
    const mo=now.getMonth();
    const map=['winter','winter','spring','spring','spring','summer','summer','summer','fall','fall','fall','winter'];
    const season=map[mo];
    heading.textContent=season.charAt(0).toUpperCase()+season.slice(1)+' '+yr;
    const d=await jFetch(`${JIKAN}/seasons/${yr}/${season}`);
    seasonalData=(d.data||[]).sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,20);
    renderSeasonal('all');
    }catch(e){
    wrap.innerHTML=`<div class="api-error"><span class="err-icon">⚠</span>Could not load seasonal data.</div>`;
    }
}
function renderSeasonal(f){
    const wrap=document.getElementById('seasonal-wrap');
    const filtered=f==='all'?seasonalData:seasonalData.filter(a=>a.type===f);
    const items=filtered.slice(0,10);
    if(!items.length){wrap.innerHTML=`<div class="api-error"><span class="err-icon">🔍</span>No ${f} titles found this season.</div>`;return;}
    const list=document.createElement('div');
    list.className='seasonal-list';
    items.forEach((a,i)=>{
    const el=document.createElement('div');
    el.className='season-item';
    const img=a.images?.webp?.image_url||a.images?.jpg?.image_url||'';
    const score=a.score?'★ '+a.score.toFixed(1):'';
    el.innerHTML=`<div class="s-num">${String(i+1).padStart(2,'0')}</div>
        <img class="s-thumb" src="${img}" alt="${a.title}" loading="lazy">
        <div class="s-info">
        <div class="s-title">${a.title_english||a.title}</div>
        <div class="s-studio">${a.studios?.[0]?.name||'Unknown Studio'}</div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:5px;">
            <span class="s-badge">${a.type||'TV'}</span>
            ${score?`<span class="s-score">${score}</span>`:''}
        </div>
        </div>`;
    list.appendChild(el);addHover(el);
    });
    wrap.innerHTML='';wrap.appendChild(list);
}
document.querySelectorAll('.s-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
    document.querySelectorAll('.s-tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');renderSeasonal(tab.dataset.f);
    });
});

// ── Boot ──────────────────────────────────────────────────
loadTrending();
setTimeout(loadFeatured, 500);
setTimeout(loadSeasonal, 300);