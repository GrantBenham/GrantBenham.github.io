import json,pathlib,urllib.request,urllib.parse,concurrent.futures
entries=json.loads(pathlib.Path('src/data/publications.json').read_text())
def fetch(e):
 if not e['doi']:return {'id':e['id'],'status':'no DOI supplied'}
 url='https://api.crossref.org/works/'+urllib.parse.quote(e['doi'],safe='')
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'AcademicWebsiteBibliographyReview/1.0'})
  with urllib.request.urlopen(req,timeout=25) as r:d=json.load(r)['message']
  return {'id':e['id'],'status':'retrieved','doi':d.get('DOI'),'title':d.get('title'),'journal':d.get('container-title'),'print':d.get('published-print'),'online':d.get('published-online'),'issued':d.get('issued'),'volume':d.get('volume'),'issue':d.get('issue'),'page':d.get('page')}
 except Exception as x:return {'id':e['id'],'status':'failed','error':str(x)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(fetch,entries))
pathlib.Path('bibliography-report.json').write_text(json.dumps(results,indent=2))
for r in results:print(json.dumps(r))
