import unittest,json,re,subprocess
from pathlib import Path
from html.parser import HTMLParser
R=Path(__file__).resolve().parents[1]
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.tags=[]
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
class StartupTests(unittest.TestCase):
 def setUp(self):self.data=json.loads((R/'startups/projects.json').read_text(encoding="utf-8"));self.pages=list((R/'startups').rglob('index.html'))
 def test_five_projects_and_six_pages(self):
  self.assertEqual(len(self.data),5);self.assertEqual(len(self.pages),6)
 def test_pages_semantics_and_links(self):
  for page in self.pages:
   with self.subTest(page=page):
    p=Parser();p.feed(page.read_text(encoding="utf-8"))
    self.assertEqual(sum(t=='h1' for t,a in p.tags),1)
    self.assertEqual(sum(t=='main' for t,a in p.tags),1)
    ids=[a['id'] for t,a in p.tags if 'id' in a];self.assertEqual(len(ids),len(set(ids)))
    for tag,a in p.tags:
     if tag=='img':self.assertIn('alt',a)
     for key in ('src','href'):
      url=a.get(key,'').split('?')[0]
      if url.startswith('/'):
       target=R/url.lstrip('/').split('#')[0]
       self.assertTrue(target.exists(),str(target))
      if url.startswith('#'):self.assertIn(url[1:],ids)
 def test_all_original_pages_link_startups(self):
  for page in R.rglob('index.html'):
   self.assertIn('href="/startups/"',page.read_text(encoding="utf-8"),str(page))
 def test_reproducible_generation(self):
  before={p:p.read_bytes() for p in self.pages}
  subprocess.run(['python',str(R/'scripts/build-startups.py')],check=True)
  self.assertEqual(before,{p:p.read_bytes() for p in self.pages})
 def test_minimal_directory_and_excluded_projects(self):
  s=(R/'startups/index.html').read_text(encoding="utf-8")
  p=Parser();p.feed(s)
  self.assertEqual(sum(a.get('class')=='startup-choice' for t,a in p.tags),5)
  for excluded in ('oraculum','autobook'):
   self.assertNotIn(excluded,s.lower())
   self.assertFalse((R/'startups'/excluded/'index.html').exists())
  self.assertNotIn('startup-filters',s)
  self.assertNotIn('hero-constellation',s)
  self.assertIn('background:#000',(R/'css/startups.css').read_text(encoding="utf-8"))
 def test_project_images_and_current_logos(self):
  for project in self.data:
   with self.subTest(project=project['id']):
    self.assertTrue((R/'assets/logos'/project['logo']).is_file())
    self.assertGreater(len(project['media']),0)
    page=(R/'startups'/project['id']/'index.html').read_text(encoding="utf-8")
    for item in project['media']:
     self.assertTrue((R/'assets/startups'/item['file']).is_file())
     self.assertIn(item['file'],page)
    for excluded in ('oraculum','autobook'):
     self.assertNotIn('/startups/'+excluded+'/',page)
if __name__=='__main__':unittest.main()
