"""Build the minimal startup selector and the five project presentations."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = json.loads((ROOT / 'startups/projects.json').read_text(encoding='utf-8'))

def logo(project):
    return f'<img src="/assets/logos/{escape(project["logo"])}" alt="" width="240" height="240">'

def head(title, description, path):
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)} | Rafylsck Industries</title>
<meta name="description" content="{escape(description)}">
<meta name="theme-color" content="#000000">
<link rel="canonical" href="https://rafylsckindustries.com.br{path}">
<meta property="og:title" content="{escape(title)} | Rafylsck Industries">
<meta property="og:description" content="{escape(description)}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://rafylsckindustries.com.br/banner.png">
<link rel="icon" href="/assets/icons/favicon-32.png">
<link rel="stylesheet" href="/css/fonts.css?v=mono2">
<link rel="stylesheet" href="/css/editorial.css?v=mono2">
<link rel="stylesheet" href="/css/startups.css?v=black3">
<script src="/js/editorial.js?v=mono2" defer></script>
</head>
<body class="startups-site">
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="masthead"><div class="wrap header-row">
<a class="wordmark" href="/" aria-label="Rafylsck Industries, início"><img src="/assets/logos/rafylsck-logo.png" alt=""><span>Rafylsck<small>INDUSTRIES</small></span></a>
<button class="menu" type="button" aria-controls="navigation" aria-expanded="false">Menu +</button>
<nav id="navigation" class="navigation" aria-label="Navegação principal">
<a href="/startups/" aria-current="{'page' if path == '/startups/' else 'true'}">Startups</a>
<a href="/#pesquisa">Pesquisa</a><a href="/rafael/">Rafael Balceiro</a>
<a class="contact-link" href="mailto:contato@rafylsckindustries.com.br">Vamos conversar</a>
</nav></div></header>
'''

def footer():
    return '''<footer class="footer"><div class="wrap footer-row"><span>© 2026 Rafylsck Industries</span><div class="footer-links"><a href="/startups/">Startups</a><a href="/legal/privacy/">Privacidade</a><a href="/legal/terms/">Termos</a></div></div></footer></body></html>'''

def tile(project):
    return f'''<a class="startup-choice" href="/startups/{project['id']}/" aria-label="Conhecer {escape(project['name'])}"><span class="choice-symbol">{logo(project)}</span><span class="choice-name">{escape(project['name'])}</span></a>'''

index = head('Startups', 'Teseu, AutoZap, AnjoGuard, JuriX Cidadão e AdHub. Selecione uma startup para conhecer sua ideia e seu desenvolvimento.', '/startups/')
index += '<main class="startup-directory wrap" id="conteudo"><h1 class="sr-only">Nossas startups</h1><div class="startup-choices" aria-label="Escolha uma startup">'
index += '\n'.join(tile(project) for project in PROJECTS)
index += '</div></main>' + footer()
(ROOT / 'startups/index.html').write_text(index, encoding='utf-8', newline='\n')

for project in PROJECTS:
    name = escape(project['name'])
    gallery = ''
    for item in project['media']:
        image_path = '/assets/startups/' + item['file']
        caption = escape(item['caption'])
        gallery += f'''<figure class="project-capture"><a href="{image_path}" aria-label="Ampliar imagem: {caption}"><img src="{image_path}" alt="{caption}" loading="lazy" decoding="async"></a><figcaption>{caption}</figcaption></figure>'''
    related = ''.join(tile(other) for other in PROJECTS if other['id'] != project['id'])
    source = f'<a class="text-link" href="{project["source"]}">Mais sobre o projeto</a>' if project.get('source') else ''
    features = ''.join(f'<li>{escape(item)}</li>' for item in project['features'])
    flow = ''.join(f'<li>{escape(step)}</li>' for step in project['flow'])
    body = head(project['name'], project['summary'], f'/startups/{project["id"]}/')
    body += f'''<main id="conteudo" style="--project:{project['color']}">
<nav class="wrap startup-breadcrumb" aria-label="Caminho"><a href="/startups/">Todas as startups</a><span aria-current="page">{name}</span></nav>
<section class="wrap startup-detail-hero"><div><p class="eyebrow">{escape(project['category'])}</p><h1>{name}</h1><p class="project-headline">{escape(project['headline'])}</p><p class="startup-lead">{escape(project['summary'])}</p><div class="actions"><a class="pill" href="#ideia">Conheça a ideia</a><a class="text-link" href="#imagens">Ver imagens</a></div></div><div class="detail-brand">{logo(project)}</div></section>
<section class="wrap startup-story" id="ideia"><div><p class="eyebrow">A ideia</p><h2>Por que<br>existe.</h2></div><div><p class="story-lead">{escape(project['about'])}</p><p class="audience"><strong>Para quem</strong>{escape(project['audience'])}</p>{source}</div></section>
<section class="wrap startup-capabilities"><div><p class="eyebrow">O projeto</p><h2>Como a ideia<br>ganha forma.</h2></div><ul>{features}</ul></section>
<section class="wrap project-experience"><p class="eyebrow">A experiência proposta</p><ol class="project-steps">{flow}</ol></section>
<section class="wrap project-gallery" id="imagens"><div class="gallery-heading"><p class="eyebrow">Por dentro do projeto</p><h2>Imagens de {name}.</h2></div><div class="gallery-grid">{gallery}</div></section>
<aside class="wrap project-stage"><p class="eyebrow">Onde estamos</p><h2>{escape(project['status'])}</h2><p>{escape(project['note'])}</p></aside>
<section class="wrap startup-contact"><h2>Vamos conversar<br>sobre {name}?</h2><a class="pill" href="mailto:contato@rafylsckindustries.com.br?subject=Contato%20sobre%20{project['id']}">Falar sobre o projeto</a></section>
<section class="wrap related-startups" aria-label="Outras startups"><h2>Conheça também</h2><div class="startup-choices">{related}</div></section>
</main>''' + footer()
    folder = ROOT / 'startups' / project['id']
    folder.mkdir(exist_ok=True)
    (folder / 'index.html').write_text(body, encoding='utf-8', newline='\n')

# Remove only the two startup presentations excluded by the owner.
for excluded in ('oraculum', 'autobook'):
    page = ROOT / 'startups' / excluded / 'index.html'
    if page.is_file():
        page.unlink()
print(f'Built directory and {len(PROJECTS)} startup presentations.')
