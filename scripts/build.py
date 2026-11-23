from pathlib import Path
P=Path(__file__).resolve().parents[1] if (Path(__file__).resolve().parents[1]/'data').exists() else Path('/mnt/files/totp1977')
def resource(name):
    sub= ('src/' if name in ('styles.css','app.js') else 'data/')+name
    return (P/sub if (P/sub).exists() else P/name)
def inline_json(name):
    return resource(name).read_text(encoding='utf8').replace('</','<\\/')
css=resource('styles.css').read_text(encoding='utf8')
js=resource('app.js').read_text(encoding='utf8')
html_code='''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0b0f13">
<meta name="description" content="Top of the Pops 1977: 53 edições, 648 ocorrências musicais, discografias, biografias e links para YouTube, Spotify e letras. Arquivo independente.">
<meta property="og:type" content="website">
<meta property="og:title" content="Top of the Pops 1977 · Arquivo musical interativo">
<meta property="og:description" content="Explore a programação da BBC de 1977 e as discografias de Tina Charles, Barclay James Harvest, T. Rex, Dead End Kids e Eddie and the Hot Rods.">
<title>TOP OF THE POPS · 1977 — Arquivo musical interativo</title>
<style>__CSS__</style>
</head>
<body>
<a class="skip" href="#content">Ir para o conteúdo</a>
<header class="top"><div class="wrap top-inner">
<a class="brand" href="#episodes" aria-label="Voltar ao arquivo de 1977"><span class="logo" aria-hidden="true">◎</span><span>TOP OF THE POPS<strong>ARQUIVO / 1977</strong></span></a>
<span class="top-note">A música britânica em transformação</span>
</div></header>
<div class="wrap">
<section class="hero" aria-label="Apresentação do arquivo"><div>
<div class="kicker">O ano em que os estilos colidiram</div>
<h1>THE SOUND<br>OF <em>1977.</em></h1>
<p class="intro">Todas as edições documentadas do <strong>Top of the Pops</strong> em 1977, com músicas organizadas por data, pesquisa rápida, biografias, discografias e caminhos diretos para ouvir e ler.</p>
</div><div class="poster" aria-hidden="true"><div class="kicker">British television archive</div><div class="poster-year">77</div><div class="poster-caption">DISCO / GLAM / PROG / PUB ROCK / PUNK<br>52 semanas. Um ano de ruptura.</div></div></section>
<div class="statbar" aria-label="Estatísticas do acervo">
<div class="stat"><b id="episodes-count">53</b><small>edições</small></div>
<div class="stat"><b id="performances-count">648</b><small>ocorrências musicais</small></div>
<div class="stat"><b id="songs-count">323</b><small>músicas distintas</small></div>
<div class="stat"><b id="artists-count">—</b><small>intérpretes</small></div>
</div>
</div>
<div class="navbar"><nav class="wrap nav-scroll" aria-label="Seções do arquivo">
<button type="button" class="nav-button active" data-nav="episodes">Edições</button>
<button type="button" class="nav-button" data-nav="songs">Músicas</button>
<button type="button" class="nav-button" data-nav="artists">Artistas & integrantes</button>
<button type="button" class="nav-button" data-nav="discs">Discografias</button>
<button type="button" class="nav-button" data-nav="favorites">Favoritos</button>
<button type="button" class="nav-button" data-nav="about">Sobre & fontes</button>
</nav></div>
<div class="wrap">
<div class="toolbar" id="toolbar" role="search" aria-label="Filtros do catálogo">
<div class="search-wrap">
<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>
<input id="search" class="field" type="search" placeholder="Buscar música, artista, álbum..." aria-label="Buscar no catálogo" autocomplete="off">
</div>
<select id="month-filter" class="field" aria-label="Filtrar por mês"><option value="">Todos os meses</option></select>
<select id="artist-filter" class="field" aria-label="Filtrar por artista"><option value="">Todos os artistas</option></select>
<label class="check"><input id="only-focus" type="checkbox"> Apenas 5 artistas em foco</label>
</div>
<p id="status" style="position:absolute;clip:rect(0 0 0 0)" aria-live="polite"></p>
<main id="content" tabindex="-1"><noscript>Ative o JavaScript para utilizar os filtros. Este arquivo não usa rastreadores ou dependências externas na interface.</noscript></main>
<footer class="foot">
<p><strong style="color:var(--ink)">TOP OF THE POPS / 1977</strong> · Projeto histórico independente · Interface em português do Brasil</p>
<p>Não afiliado à BBC. O site não reproduz fonogramas, vídeos ou letras. Links externos abrem plataformas e buscas de conteúdo. Registro da programação: <a href="https://totparchive.co.uk/" target="_blank" rel="noopener noreferrer">Top of the Pops Archive</a> e <a href="https://tvrdb.com/totp/1977" target="_blank" rel="noopener noreferrer">TVRDb</a>; discografias: <a href="https://musicbrainz.org/" target="_blank" rel="noopener noreferrer">MusicBrainz</a>.</p>
<p>Data de compilação: novembro de 2026 · <a href="https://github.com/mesquita1991/totp-1977-arquivo" target="_blank" rel="noopener noreferrer">Código e dados no GitHub</a>.</p>
</footer>
</div>
<script id="episodes-data" type="application/json">__EPISODES__</script>
<script id="discographies-data" type="application/json">__DISCOGS__</script>
<script id="profiles-data" type="application/json">__PROFILES__</script>
<script>__JS__</script>
</body></html>'''
for k,v in [('__CSS__',css),('__JS__',js),('__EPISODES__',inline_json('episodes.json')),('__DISCOGS__',inline_json('discographies.json')),('__PROFILES__',inline_json('profiles.json'))]:
    html_code=html_code.replace(k,v)
(P/'index.html').write_text(html_code,encoding='utf8')
print('built',len(html_code.encode('utf8')),'bytes')
