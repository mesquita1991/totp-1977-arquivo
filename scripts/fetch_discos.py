import requests,json,time,random
from pathlib import Path
ARTISTS=[
('tina','Tina Charles','93117a67-55b4-4b18-94c4-35c8a75fefc2'),
('bjh','Barclay James Harvest','3ab1e5df-cd3b-479e-a756-3f326cea5572'),
('trex','T. Rex','c842d29f-a297-48cd-bb71-4f77fd672b16'),
('dead','Dead End Kids','721b93d8-9b6d-4d34-8df7-7394527b0024'),
('eddie','Eddie and the Hot Rods','e062ce8b-19cc-4308-b37b-f62b7adfb6c2')]
session=requests.Session()
session.headers.update({'User-Agent':'TOTP1977Catalogue/1.0 (research contact: historical-music@example.org)'})
allart=[]
for slug,name,mbid in ARTISTS:
    rec=[];offset=0;expected=1
    while offset<expected and offset<500:
        url='https://musicbrainz.org/ws/2/release-group'
        for a in range(6):
            try:
                resp=session.get(url,params={'artist':mbid,'fmt':'json','limit':100,'offset':offset},timeout=25)
                if resp.status_code==200: break
            except Exception as e: pass
            time.sleep(1.7*(a+1))
        if resp.status_code!=200:
            print('ERROR',name,offset,resp.status_code)
            break
        result=resp.json()
        expected=result.get('release-group-count',0)
        rec+=result.get('release-groups',[])
        offset+=len(result.get('release-groups',[]))
        if not result.get('release-groups',[]):break
        time.sleep(1.3)
    normalize=[]
    for o in rec:
        normalize.append({'id':o['id'],'title':o.get('title',''),'date':o.get('first-release-date',''),'type':o.get('primary-type') or 'Other','secondary':o.get('secondary-types',[])})
    normalize.sort(key=lambda o:(o['date'] if o['date'] else '9999',o['type'],o['title']))
    allart.append({'slug':slug,'name':name,'mbid':mbid,'catalog':normalize,'count':len(normalize)})
    print(name,len(normalize), 'type_counts',{t:sum(1 for r in normalize if r['type']==t) for t in ['Album','Single','EP','Other']})
p=Path('/mnt/files/totp1977/discographies.json')
p.write_text(json.dumps(allart,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('written',p.stat().st_size)
