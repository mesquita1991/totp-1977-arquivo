# Top of the Pops · 1977

Catálogo estático, responsivo e independente das 53 edições de Top of the Pops de 1977.

## Conteúdo

- 53 programas, incluindo os especiais de 25 e 26 de dezembro.
- 648 ocorrências musicais; 323 pares distintos de artista e título.
- Busca por artista/título, mês e cinco artistas destacados.
- Links de busca do YouTube, Spotify e letras para cada faixa; links diretos para vídeos somente quando identificados pela fonte.
- Perfis e 27 integrantes principais de Tina Charles, Barclay James Harvest, T. Rex, Dead End Kids e Eddie and the Hot Rods.
- 374 grupos de lançamento MusicBrainz por artista, tipo e categoria.
- Faixas dos álbuns carregadas sob demanda via API pública MusicBrainz, sujeita a disponibilidade e limites.
- Favoritos armazenados localmente no navegador.

## Abrir

Site público: https://mesquita1991.github.io/totp-1977-arquivo/

O arquivo index.html é autossuficiente (CSS, JavaScript e dados incorporados). Pode ser aberto mesmo sem servidor local; consultas remotas de faixas e links externos requerem internet.

## Fontes e limitações

- Episódios: https://totparchive.co.uk/
- Conferência do ano: https://tvrdb.com/totp/1977
- Discografia: https://musicbrainz.org/
- Paradas: https://www.officialcharts.com/

O MusicBrainz é colaborativo e pode conter omissões ou inconsistências. Um grupo de lançamento não corresponde a cada prensagem física; a lista de faixas aberta sob demanda provém de uma edição documentada, que pode diferir do LP original. A presença histórica de uma música na programação não implica acesso público ao vídeo original. Os links de busca não garantem a disponibilidade das gravações.

Projeto não afiliado à BBC, Spotify, YouTube, Genius ou MusicBrainz. Não hospeda fonogramas, vídeos ou letras.

## Estrutura

- index.html: distribuição completa, arquivo único.
- src/app.js e src/styles.css: código-fonte editável.
- data/episodes.json: repertório dos 53 programas.
- data/discographies.json: lançamentos registrados.
- data/profiles.json: perfis editoriais.
- scripts/build.py, scripts/fetch_episodes.py, scripts/fetch_discos.py: rotinas de manutenção.

Para regenerar, ajuste o caminho base dos scripts para a sua pasta local e execute o builder depois de atualizar os dados.

Dados, nomes e marcas de terceiros mantêm os respectivos direitos; código original disponibilizado para estudo e reutilização com atribuição.
