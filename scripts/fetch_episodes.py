import requests,re,json,datetime,time,concurrent.futures
from bs4 import BeautifulSoup,NavigableString
from pathlib import Path
BASE='https://totparchive.co.uk/episode.php?id='
HEAD={'User-Agent':'TOTP-1977-Catalogue/1.0 (+educational reference; respectful archival indexing)'}
def one(i):
    for at in range(2):
        try:
            r=requests.get(BASE+str(i),headers=HEAD,timeout=20)
            if r.status_code!=200:return None
            s=BeautifulSoup(r.text,'html.parser')
            h=s.select_one('h1#page-header')
            if not h:return None
            date={726:'25/12/1977',727:'26/12/1977'}.get(i,h.get_text(strip=True))
            if not re.fullmatch(r'\d{2}/\d{2}/1977',date):return None
            rows=[]
            t=s.select_one('table.table-hover')
            if not t:return {'id':i,'date':date,'songs':[],'warning':'No performance table'}
            for tr in t.select('tbody tr'):
                cells=tr.find_all('td',recursive=False)
                if len(cells)<2:continue
                c=cells[1]
                a=c.select_one('a strong')
                if not a:continue
                artist=a.get_text(' ',strip=True)
                candidates=[x.strip() for x in c.contents if isinstance(x,NavigableString) and str(x).strip()]
                title=candidates[0] if candidates else re.sub(r'\s+',' ',c.get_text(' ',strip=True)).split(' by ')[0]
                if not title or len(title)>180:continue
                badge=c.select_one('span.badge')
                typ=badge.get_text(' ',strip=True) if badge else ''
                chart=cells[-1].get_text(' ',strip=True)
                vids=[a.get('href','') for a in cells[-2].select('a[href]')] if len(cells)>4 else []
                rows.append({'title':title,'artist':artist,'kind':typ,'chart':chart,'video':next((v for v in vids if 'youtube' in v or 'youtu.be' in v),'')})
            desc=s.select_one('meta[name="description"]')
            return {'id':i,'date':date,'special':i in (726,727),'songs':rows,'url':BASE+str(i),'description':desc.get('content','') if desc else ''}
        except Exception as e:
            err=str(e)
            time.sleep(1)
    return {'id':i,'error':err}
ids=list(range(675,735))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results=list(pool.map(one,ids))
episodes=[r for r in results if r and r.get('date')]
episodes.sort(key=lambda x:datetime.datetime.strptime(x['date'],'%d/%m/%Y'))
root=Path(__file__).resolve().parents[1]
p=(root/'data'/'episodes.json') if (root/'data').exists() else Path('/mnt/files/totp1977/episodes.json')
p.parent.mkdir(parents=True,exist_ok=True)
p.write_text(json.dumps(episodes,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('episodes',len(episodes),'songs',sum(len(e['songs']) for e in episodes),'dates',[e['date'] for e in episodes[:2]+episodes[-3:]])
print('errors',[e for e in results if e and e.get('error')])
print('zero',[e['date'] for e in episodes if not e['songs']])
print('sample',episodes[11]['date'],episodes[11]['songs'][:3])
