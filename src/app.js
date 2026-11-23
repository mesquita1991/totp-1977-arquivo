(function(){
'use strict';
const EPS=JSON.parse(document.getElementById('episodes-data').textContent);
const DISCS=JSON.parse(document.getElementById('discographies-data').textContent);
const PROFILES=JSON.parse(document.getElementById('profiles-data').textContent);
const $=(s,root=document)=>root.querySelector(s);
const M=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const IDS=['tina','bjh','trex','dead','eddie'];
const ART=Object.fromEntries(DISCS.map(d=>[d.slug,d]));
const aliases={tina:['tina charles'],bjh:['barclay james harvest'],trex:['t. rex','t rex','t-rex'],dead:['dead end kids','the dead end kids'],eddie:['eddie and the hot rods','eddie & the hot rods','the rods']};
const S={view:'episodes',month:'',focus:false,artist:'',q:'',displayLimit:80,discArtist:'trex',discType:'studio',discLimit:36,profile:'',favorites:new Set()};
try{S.favorites=new Set(JSON.parse(localStorage.getItem('totp1977_favorites')||'[]'));}catch(err){}
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const focusId=name=>IDS.find(id=>aliases[id].includes(norm(name)))||'';
const queryLink=(site,s)=>site==='yt'?'https://www.youtube.com/results?search_query='+encodeURIComponent(s):site==='sp'?'https://open.spotify.com/search/'+encodeURIComponent(s):'https://www.google.com/search?q='+encodeURIComponent(s+' letra lyrics site:genius.com OR site:letras.mus.br');
const out=(url,label,cl='action')=>'<a class="'+cl+'" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">'+esc(label)+'</a>';
const songkey=x=>encodeURIComponent(norm(x.artist)+'|'+norm(x.title));
const isHit=(txt)=>norm(txt).includes(norm(S.q));
const monthOf=date=>Number(date.split('/')[1]);
const dateOf=date=>date.split('/').reverse().join('-');
const episodes=EPS.slice().sort((a,b)=>dateOf(a.date).localeCompare(dateOf(b.date)));
const all=(()=>{const map=new Map();for(const ep of episodes){for(const song of ep.songs){const key=songkey(song);if(!map.has(key))map.set(key,{...song,appearances:[]});map.get(key).appearances.push({date:ep.date,id:ep.id});}}return [...map.values()].sort((a,b)=>a.artist.localeCompare(b.artist)||a.title.localeCompare(b.title));})();
const artistCounts=(()=>{const c={};for(const s of all)c[s.artist]=(c[s.artist]||0)+1;return Object.entries(c).sort((a,b)=>a[0].localeCompare(b[0]));})();
function saveFavorites(){try{localStorage.setItem('totp1977_favorites',JSON.stringify([...S.favorites]));}catch(err){}}
function songLinks(s,extended=false){const text=s.artist+' '+s.title;
 const href=(s.video&&/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(s.video))?s.video:queryLink('yt',text+' Top of the Pops 1977');
 return out(href,s.video?'Vídeo identificado':'YouTube ↗',s.video?'action primary':'action')+out(queryLink('sp',text),'Spotify ↗')+out(queryLink('ly',text),'Letra ↗')+(extended?out('https://www.google.com/search?q='+encodeURIComponent(text+' discogs musicbrainz'),'Ficha ↗'):'');
}
function songRow(s,opts={}){const id=focusId(s.artist),key=songkey(s),fav=S.favorites.has(key);
 return '<article class="track"><div><div class="track-title">'+esc(s.title)+'</div><div class="track-artist">'+esc(s.artist)+(id?' · <a href="#artistas/'+id+'" data-profile="'+id+'">Biografia</a>':'')+'</div>'+
 '<div class="track-meta">'+(opts.hideKind?'':'<span class="tag">'+esc(s.kind||'Música')+'</span>')+(opts.appearances?'<span class="tag accent">'+opts.appearances+' edição(ões)</span>':'')+(opts.date?'<span class="tag">'+esc(opts.date)+'</span>':'')+'</div></div>'+
 '<div class="actions">'+songLinks(s)+'<button class="fav" type="button" data-fav="'+key+'" aria-label="'+(fav?'Retirar dos':'Adicionar aos')+' favoritos" aria-pressed="'+fav+'" title="Favorito">'+(fav?'★':'☆')+'</button></div></article>';
}
function sectionHead(name,sub,count){return '<div class="section-heading"><div><h2>'+esc(name)+'</h2><p>'+esc(sub)+'</p></div><span class="count">'+esc(count)+'</span></div>';}
function showEmpty(){return '<div class="empty">Nenhum resultado com os filtros atuais. Remova um filtro ou tente outro termo.</div>';}
function focusOnly(s){return !S.focus||Boolean(focusId(s.artist));}
function matches(s){return (!S.artist||norm(s.artist)===norm(S.artist))&&focusOnly(s)&&(!S.q||isHit(s.artist+' '+s.title+' '+s.kind));}
function renderEpisodes(){
 const relevant=episodes.map(ep=>({...ep,songs:ep.songs.filter(matches)})).filter(ep=>(!S.month||monthOf(ep.date)===Number(S.month))&&ep.songs.length);
 let body=sectionHead('Edições de 1977','Arquivo cronológico de aparições na televisão britânica.',relevant.length+' edições');
 body+='<div class="notice">Os links do YouTube e Spotify indicados como busca não garantem a existência da apresentação original. Links de vídeo identificados no arquivo histórico recebem destaque próprio. As listas incluem vídeos, coreografias e reaparições.</div>';
 if(!relevant.length)return body+showEmpty();
 let last=0;
 for(const ep of relevant){
   const m=monthOf(ep.date);if(m!==last){if(last)body+='</div>';body+='<section class="month"><div class="month-title">'+M[m-1]+' 1977</div>';last=m;}
   const present=(ep.description||'').match(/Introduced by ([^.]+)\./i);const host=ep.special?(ep.id===726?'Noel Edmonds e David Jensen':'Tony Blackburn e Dave Lee Travis'):(present?present[1]:'');
   body+='<details class="ep" data-ep="'+ep.id+'"><summary><div class="ep-date"><span class="day">'+esc(ep.date.slice(0,2))+'</span><small class="sep">/</small>'+esc(ep.date.slice(3,5))+'</div>'+
   '<div class="ep-info"><strong>'+(ep.special?'Especial de Natal':'Edição nº '+ep.id)+'</strong><p>'+esc(host||'Top of the Pops')+'</p></div>'+
   '<span class="count">'+ep.songs.length+' registros</span><span class="ep-chevron" aria-hidden="true">⌄</span></summary><div class="ep-content"><div class="ep-tracks" data-populate="'+ep.id+'"></div><p class="listsource">'+out(ep.url,'Ver registro de arquivo ↗')+'</p></div></details>';
 }
 body+='</section>';return body;
}
function renderSongs(){
 const f=all.filter(matches).filter(s=>!S.month||s.appearances.some(a=>monthOf(a.date)===Number(S.month)));
 let body=sectionHead('Índice de músicas','Entradas únicas, sem perder a referência às aparições repetidas.',f.length+' músicas');
 if(!f.length)return body+showEmpty();
 body+='<div class="notice">Uma mesma faixa pode ter aparecido várias vezes no programa, incluindo performances diferentes, videoclipes ou sequências de dança. Esta seção agrupa artista e título.</div>';
 body+='<div class="song-list">'+f.slice(0,S.displayLimit).map(s=>songRow(s,{appearances:s.appearances.length,hideKind:true})).join('')+'</div>';
 if(f.length>S.displayLimit)body+='<div class="more"><button type="button" data-more="songs">Carregar mais '+Math.min(80,f.length-S.displayLimit)+' músicas</button></div>';
 return body;
}
function featureCard(id){
 const p=PROFILES[id],d=ART[id],n=all.filter(s=>focusId(s.artist)===id).length;
 return '<article class="band"><div class="band-top"><div class="monogram" aria-hidden="true">'+esc(p.label.split(' ').map(x=>x[0]).slice(0,2).join(''))+'</div><div><h3>'+esc(p.label)+'</h3><small>'+esc(p.region)+' · '+esc(p.period)+'</small></div></div>'+
 '<p>'+esc(p.lead)+'</p><div class="track-meta"><span class="tag accent">'+n+' faixas no ano</span><span class="tag">'+d.catalog.length+' lançamentos registrados</span></div>'+
 '<div class="band-actions"><button type="button" class="action primary" data-profile="'+id+'">Biografia e integrantes</button><button class="action" type="button" data-disc="'+id+'">Discografia completa ↗</button>'+
 out(queryLink('yt',p.label+' 1977'),'Vídeos ↗')+'</div></article>';
}
function fullProfile(id){
 const p=PROFILES[id];
 if(!p)return '';
 let html='<section class="band-full" id="profile-'+id+'"><div class="kicker">Perfil histórico</div><h3>'+esc(p.label)+'</h3><p class="lead">'+esc(p.lead)+'</p>';
 html+='<div class="track-meta"><span class="tag accent">'+esc(p.genre)+'</span><span class="tag">'+esc(p.region)+'</span></div>';
 html+=p.bio.map(x=>'<p>'+esc(x)+'</p>').join('');
 html+='<h4 class="section-small">Linha do tempo</h4><ul class="era">'+p.periods.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
 html+='<h4 class="section-small">'+(id==='tina'?'Artista':'Formação e integrantes')+'</h4><div class="people">';
 html+=p.members.map(m=>'<div class="person"><strong>'+esc(m.name)+'</strong><small>'+esc(m.role)+'</small><p>'+esc(m.bio)+'</p>'+out('https://www.google.com/search?q='+encodeURIComponent(m.name+' '+p.label+' biografia'),'Pesquisar biografia ↗')+'</div>').join('');
 html+='</div>';
 if(p.collaborators){html+='<h4 class="section-small">Colaboradores relevantes</h4><div class="people">'+p.collaborators.map(m=>'<div class="person"><strong>'+esc(m.name)+'</strong><small>'+esc(m.role)+'</small><p>'+esc(m.bio)+'</p></div>').join('')+'</div>';}
 html+='<div class="band-actions"><button class="action primary" data-disc="'+id+'">Ver catálogo discográfico</button><button class="action" data-band-songs="'+id+'">Ver participações em 1977</button>'+out('https://musicbrainz.org/artist/'+ART[id].mbid,'Ficha MusicBrainz ↗')+'</div>';
 html+='<h4 class="section-small">Fontes para aprofundamento</h4><div class="band-actions">'+p.sources.map((u,i)=>out(u,'Referência '+(i+1)+' ↗')).join('')+'</div></section>';
 return html;
}
function renderArtists(){
 let body=sectionHead('Artistas em foco','Cinco trajetórias diferentes, um mesmo palco televisivo.','5 perfis');
 body+='<div class="cardgrid">'+IDS.map(featureCard).join('')+'</div>';
 if(S.profile&&PROFILES[S.profile])body+=fullProfile(S.profile);
 body+='<h3 class="section-small">Outros intérpretes de 1977</h3>';
 body+='<p class="listsource">Índice alfabético de todos os intérpretes presentes no levantamento. O aprofundamento biográfico está disponível nos cinco perfis acima.</p>';
 const f=artistCounts.filter(([name])=>!S.q||isHit(name));
 body+='<div class="letter-index">'+f.map(([name,count])=>'<button class="chip" data-artist-filter="'+esc(name)+'">'+esc(name)+' <small>('+count+')</small></button>').join('')+'</div>';
 return body;
}
function classify(r,t){
 const ss=(r.secondary||[]).map(norm);
 if(t==='all')return true;
 if(t==='studio')return r.type==='Album'&&!ss.some(s=>['compilation','live','remix','soundtrack','demo','interview','dj-mix','mixtape','audiobook','spokenword'].includes(s));
 if(t==='album')return r.type==='Album';
 if(t==='compilation')return ss.includes('compilation');
 if(t==='live')return ss.includes('live');
 if(t==='single')return r.type==='Single';
 if(t==='ep')return r.type==='EP';
 return true;
}
function renderDiscs(){
 const p=PROFILES[S.discArtist],d=ART[S.discArtist];
 const types=[['studio','Álbuns de estúdio'],['album','Todos os álbuns'],['single','Singles'],['ep','EPs'],['compilation','Coletâneas'],['live','Ao vivo'],['all','Tudo']];
 const catalog=d.catalog.filter(x=>classify(x,S.discType)&&(!S.q||isHit(x.title+' '+x.date)));
 let body=sectionHead('Discografias expandidas','Gravações agrupadas por artista, formato e tipo de lançamento.',DISCS.reduce((n,a)=>n+a.catalog.length,0)+' entradas');
 body+='<div class="notice">Catálogo MusicBrainz: são grupos de lançamentos, não cada prensagem ou reedição física. A classificação depende do cadastro colaborativo. Ao expandir um álbum, o site consulta as faixas de uma edição documentada, que pode diferir de outras edições.</div>';
 body+='<div class="chips">'+IDS.map(id=>'<button type="button" data-disc="'+id+'" class="chip '+(id===S.discArtist?'active':'')+'">'+esc(PROFILES[id].label)+'</button>').join('')+'</div>';
 body+='<div class="band-top" style="margin:19px 0"><div class="monogram">'+esc(p.label.split(' ').map(x=>x[0]).slice(0,2).join(''))+'</div><div><h3 style="margin:0;font-size:23px">'+esc(p.label)+'</h3><small>'+d.catalog.length+' grupos de lançamento no MusicBrainz · '+esc(p.genre)+'</small></div></div>';
 body+='<div class="chips">'+types.map(([key,label])=>'<button data-type="'+key+'" class="chip '+(S.discType===key?'active':'')+'">'+label+'</button>').join('')+'</div>';
 if(!catalog.length)return body+showEmpty();
 body+='<p class="listsource">'+catalog.length+' registros nesta seleção · clique para abrir a lista de faixas. '+out('https://musicbrainz.org/artist/'+d.mbid,'Catálogo de origem ↗')+'</p>';
 body+='<div class="discgrid">'+catalog.slice(0,S.discLimit).map(r=>{
 const yr=String(r.date||'—').slice(0,4);
 const typ=[r.type].concat(r.secondary||[]).join(' · ');
 return '<details class="release" data-release="'+esc(r.id)+'" data-singer="'+esc(S.discArtist)+'" data-release-title="'+esc(r.title)+'"><summary><span class="release-year">'+esc(yr)+'</span><div style="flex:1;min-width:0"><div class="release-title">'+esc(r.title)+'</div><div class="release-type">'+esc(typ)+'</div></div><span class="ep-chevron">⌄</span></summary><div class="release-details">'+
 '<div class="actions" style="justify-content:flex-start">'+out(queryLink('yt',p.label+' '+r.title+' full album'),'YouTube álbum ↗')+out(queryLink('sp',p.label+' '+r.title),'Spotify álbum ↗')+out('https://musicbrainz.org/release-group/'+r.id,'Ficha MusicBrainz ↗')+'</div><div class="tracklist"><p class="listsource">Abra este álbum para recuperar a lista de faixas de uma edição catalogada.</p></div></div></details>';
 }).join('')+'</div>';
 if(catalog.length>S.discLimit)body+='<div class="more"><button data-more="discs">Carregar mais '+Math.min(36,catalog.length-S.discLimit)+' lançamentos</button></div>';
 return body;
}
function renderFavorites(){
 const f=all.filter(s=>S.favorites.has(songkey(s))).filter(matches);
 let body=sectionHead('Favoritos','Salvos apenas no navegador deste dispositivo.',f.length+' músicas');
 body+='<div class="notice">Os favoritos ficam no armazenamento local do navegador. Não é necessário criar conta; eles não são sincronizados entre dispositivos.</div>';
 return body+(f.length?f.map(s=>songRow(s,{appearances:s.appearances.length,hideKind:true})).join(''):showEmpty());
}
function renderAbout(){
 let body=sectionHead('Sobre o arquivo','Contexto, metodologia, proveniência e limitações.','1977');
 body+='<div class="slim"><p class="lead" style="font-size:19px">1977 foi um ano de coexistência: disco, glam rock, progressivo, pub rock e punk disputavam o mesmo horário da BBC.</p>';
 body+='<div class="timeline">'+[
 ['Janeiro','Tina Charles aparece com Dr. Love; a disco music já ocupava o Top 10.'],
 ['Março','Barclay James Harvest, T. Rex e Dead End Kids surgem em edições próximas, revelando a convivência do progressivo com o glam pop.'],
 ['Abril','Eddie and the Hot Rods aparecem enquanto novas bandas de punk e new wave entram nas paradas.'],
 ['Julho','A BBC exibe os Sex Pistols e o impacto do punk deixa de estar restrito aos clubes.'],
 ['Dezembro','Os especiais de Natal recapitulam os sucessos do ano.']
 ].map(a=>'<div class="timeline-item"><b>'+esc(a[0])+'</b><p>'+esc(a[1])+'</p></div>').join('')+'</div>';
 body+='<h3 class="section-small">O que está incluído</h3><p>53 edições, 648 ocorrências musicais, 323 pares únicos de artista e título, cinco perfis biográficos com 27 integrantes principais e '+DISCS.reduce((n,a)=>n+a.catalog.length,0)+' registros de lançamentos do MusicBrainz. Os especiais de 25 e 26 de dezembro integram o ano.</p>';
 body+='<h3 class="section-small">Fontes documentais</h3><p>'+out('https://totparchive.co.uk/','Top of the Pops Archive ↗')+' '+out('https://tvrdb.com/totp/1977','TVRDb — 53 programas ↗')+' '+out('https://musicbrainz.org/','MusicBrainz ↗')+' '+out('https://www.officialcharts.com/','Official Charts ↗')+'</p>';
 body+='<h3 class="section-small">Critérios editoriais</h3><p>As aparições foram transcritas a partir dos registros públicos de programação do arquivo Top of the Pops, preservando a ordem do repertório por episódio. O tipo de execução (dublagem, ao vivo, videoclipe, dança) segue a taxonomia do arquivo. Algumas fitas originais foram perdidas ou não estão publicamente acessíveis, mesmo quando a participação consta dos registros históricos.</p>';
 body+='<p>Os catálogos discográficos refletem os registros associados ao artista selecionado no MusicBrainz na data da coleta. Reedições, gravações póstumas, coletâneas e subdivisões podem produzir entradas adicionais ou omissões. As listas de faixas são consultadas sob demanda, sem prometer correspondência exata com cada edição original.</p>';
 body+='<h3 class="section-small">Direitos autorais e marcas</h3><p>Projeto independente, não afiliado à BBC, Spotify, YouTube, Genius ou MusicBrainz. Não hospeda áudio, videoclipes ou letras. As ações externas levam a buscas ou a páginas de terceiros, onde a disponibilidade depende de direitos e localização.</p>';
 body+='<p>Dados das apresentações: arquivo independente Top of the Pops; metadados de lançamentos: MusicBrainz. Biografias: sínteses editoriais com referências nos perfis dos artistas.</p>';
 body+='</div>';return body;
}
const panel=$('#content'),search=$('#search'),month=$('#month-filter'),artistFilter=$('#artist-filter'),onlyFocus=$('#only-focus');
for(let i=1;i<=12;i++){const o=document.createElement('option');o.value=String(i);o.textContent=M[i-1];month.append(o);}
for(const [name,count] of artistCounts){const o=document.createElement('option');o.value=name;o.textContent=name+' ('+count+')';artistFilter.append(o);}
function render(){
 document.querySelectorAll('[data-nav]').forEach(b=>{const active=b.dataset.nav===S.view;b.classList.toggle('active',active);b.setAttribute('aria-current',active?'page':'false');});
 $('#toolbar').style.display=(S.view==='artists'||S.view==='about')?'none':'grid';
 $('#month-filter').style.display=['episodes','songs','favorites'].includes(S.view)?'block':'none';
 $('#artist-filter').style.display=['episodes','songs','favorites'].includes(S.view)?'block':'none';
 $('#only-focus').closest('label').style.display=['episodes','songs','favorites'].includes(S.view)?'flex':'none';
 let html='';
 switch(S.view){
  case 'episodes':html=renderEpisodes();break;
  case 'songs':html=renderSongs();break;
  case 'artists':html=renderArtists();break;
  case 'discs':html=renderDiscs();break;
  case 'favorites':html=renderFavorites();break;
  case 'about':html=renderAbout();break;
 }
 panel.innerHTML=html;
 $('#status').textContent=({'episodes':'Edições de 1977','songs':'Músicas de 1977','artists':'Biografias','discs':'Discografias','favorites':'Favoritos','about':'Sobre o projeto'})[S.view];
}
function changeView(next,opts={}){
 S.view=next;
 if(opts.profile)S.profile=opts.profile;
 if(opts.discArtist)S.discArtist=opts.discArtist;
 if(opts.clear){S.q='';search.value='';S.artist='';S.month='';artistFilter.value='';month.value='';}
 S.displayLimit=80;S.discLimit=36;
 const route=next==='artists'&&S.profile?'artistas/'+S.profile:next==='discs'?'discografias/'+S.discArtist:next;
 history.replaceState(null,'','#'+route);
 render();
 document.querySelector('.navbar').scrollIntoView({behavior:'smooth',block:'start'});
}
let debounce;
search.addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{S.q=search.value;S.displayLimit=80;S.discLimit=36;render();},130);});
month.addEventListener('change',()=>{S.month=month.value;render();});
artistFilter.addEventListener('change',()=>{S.artist=artistFilter.value;render();});
onlyFocus.addEventListener('change',()=>{S.focus=onlyFocus.checked;render();});
document.addEventListener('click',ev=>{
 const btn=ev.target.closest('[data-nav],[data-profile],[data-disc],[data-type],[data-more],[data-fav],[data-band-songs],[data-artist-filter]');
 if(!btn)return;
 if(btn.matches('a'))ev.preventDefault();
 if(btn.dataset.nav){S.profile='';changeView(btn.dataset.nav);return;}
 if(btn.dataset.profile){changeView('artists',{profile:btn.dataset.profile});return;}
 if(btn.dataset.disc){S.discType='studio';changeView('discs',{discArtist:btn.dataset.disc,clear:true});return;}
 if(btn.dataset.type){S.discType=btn.dataset.type;S.discLimit=36;render();return;}
 if(btn.dataset.more){if(btn.dataset.more==='songs')S.displayLimit+=80;else S.discLimit+=36;render();return;}
 if(btn.dataset.bandSongs){S.artist=PROFILES[btn.dataset.bandSongs].label;artistFilter.value=S.artist;S.month='';month.value='';changeView('episodes');return;}
 if(btn.dataset.artistFilter){S.artist=btn.dataset.artistFilter;artistFilter.value=S.artist;S.month='';S.q='';search.value='';changeView('episodes');return;}
 if(btn.dataset.fav){
   const key=btn.dataset.fav;
   if(S.favorites.has(key))S.favorites.delete(key);else S.favorites.add(key);
   saveFavorites();
   document.querySelectorAll('[data-fav="'+CSS.escape(key)+'"]').forEach(b=>{
    const on=S.favorites.has(key);b.textContent=on?'★':'☆';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',(on?'Retirar dos':'Adicionar aos')+' favoritos');
   });
   if(S.view==='favorites')render();
 }
});
function populateEpisode(details){
 const id=Number(details.dataset.ep),ep=episodes.find(x=>x.id===id),target=details.querySelector('.ep-tracks');
 if(!ep||!target||target.dataset.ready)return;
 const list=ep.songs.filter(matches);
 target.innerHTML=list.map(s=>songRow(s)).join('');
 target.dataset.ready='true';
}
const sleep=ms=>new Promise(res=>setTimeout(res,ms));
let apiQueue=Promise.resolve();
function mbAPI(url){
 const job=apiQueue.then(async()=>{
  for(let i=0;i<3;i++){
   await sleep(1150);
   const r=await fetch(url,{headers:{'Accept':'application/json'}});
   if(r.ok)return r.json();
   if(i===2)throw Error('MusicBrainz HTTP '+r.status);
   await sleep(1000*(i+1));
  }
 });
 apiQueue=job.catch(()=>{});
 return job;
}
const trackCache=new Map();
async function loadRelease(details){
 const target=details.querySelector('.tracklist');
 if(!target||details.dataset.loaded)return;
 details.dataset.loaded='loading';
 const id=details.dataset.release,name=PROFILES[details.dataset.singer].label;
 target.innerHTML='<p class="listsource" role="status">Consultando faixas documentadas no MusicBrainz…</p>';
 try{
  let tracks=trackCache.get(id);
  if(!tracks){
   const list=await mbAPI('https://musicbrainz.org/ws/2/release?release-group='+encodeURIComponent(id)+'&fmt=json&limit=30');
   const releases=(list.releases||[]).slice().sort((a,b)=>{
    const score=x=>(x.status==='Official'?4:0)+(x.country==='GB'?2:0)+(x['track-count']||0?1:0);
    return score(b)-score(a);
   });
   if(!releases.length)throw Error('Sem edição com lista de faixas.');
   const info=await mbAPI('https://musicbrainz.org/ws/2/release/'+releases[0].id+'?inc=recordings&fmt=json');
   tracks=[];
   for(const medium of info.media||[]){
    for(const tr of medium.tracks||[]){
     if(tr.title)tracks.push({title:tr.title,artist:(tr['artist-credit']||[]).map(x=>x.name||'').filter(Boolean).join('')||name,kind:'Faixa',chart:'',video:'',number:tr.number,disc:medium.position});
    }
   }
   if(!tracks.length)throw Error('Sem faixas nesta edição.');
   trackCache.set(id,tracks);
  }
  if(!target.isConnected)return;
  target.innerHTML='<p class="listsource">'+tracks.length+' faixa(s) · lista de uma edição documentada, não necessariamente a prensagem original.</p>'+
   tracks.map((t,i)=>'<div class="track"><div><div class="track-title"><span style="color:var(--muted);font-size:12px;margin-right:8px">'+(i+1)+'.</span>'+esc(t.title)+'</div><div class="track-artist">'+esc(t.artist||name)+'</div></div><div class="actions">'+songLinks(t)+'</div></div>').join('');
  details.dataset.loaded='done';
 }catch(err){
   if(!target.isConnected)return;
   target.innerHTML='<p class="listsource">Não foi possível consultar o serviço discográfico neste momento. Você ainda pode usar os links do álbum acima ou visitar diretamente o MusicBrainz. ('+esc(err.message)+')</p>';
   details.dataset.loaded='';
 }
}
document.addEventListener('toggle',ev=>{
 const d=ev.target;if(!d.matches||!d.open)return;
 if(d.classList.contains('ep'))populateEpisode(d);
 if(d.classList.contains('release'))loadRelease(d);
},true);
window.addEventListener('hashchange',route);
function route(){
 const h=decodeURIComponent(location.hash.slice(1));
 if(h.startsWith('artistas/')){S.profile=h.split('/')[1];S.view='artists';}
 else if(h.startsWith('discografias/')){S.discArtist=h.split('/')[1]||'trex';S.view='discs';}
 else if(['episodes','songs','artists','discs','favorites','about'].includes(h)){S.view=h;}
 render();
}
$('#episodes-count').textContent=episodes.length;
$('#performances-count').textContent=episodes.reduce((n,x)=>n+x.songs.length,0);
$('#songs-count').textContent=all.length;
$('#artists-count').textContent=artistCounts.length;
route();
})();
