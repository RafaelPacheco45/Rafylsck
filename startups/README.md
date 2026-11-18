# Área de startups

A entrada `/startups/` usa fundo preto, com apenas os símbolos e nomes das cinco startups: Teseu, AutoZap, AnjoGuard, JuriX Cidadão e AdHub. Cada marca leva à sua apresentação, com ideia, público, recursos, imagens e estágio atual. Oraculum e AutoBook foram removidos apenas desta área; suas páginas originais no restante do site foram preservadas.

Edite `projects.json` e execute:

```sh
python scripts/build-startups.py
python -m unittest discover -s tests -v
```

As páginas são estáticas e a seleção funciona sem JavaScript. O menu móvel reutiliza `js/editorial.js`. A galeria permite abrir cada imagem em tamanho original.

## Assets

Teseu usa o símbolo limpo da publicação atual de `Teseu-Site-Ingles`. JuriX usa o ícone v6 da identidade atual do JuriX Cidadão. A nova marca AnjoGuard foi gerada com a ferramenta integrada image_gen, usando a marca anterior como referência. Prompt: redesenhar o símbolo de asas, lente de câmera e halo, com formas brancas simplificadas, anel verde profundo, sem texto e com transparência. Arquivo final: `assets/logos/anjoguard-symbol-v2.png`.

As imagens de Teseu e AutoZap são capturas existentes das interfaces. Os dados do cliente no AutoZap são fictícios de teste. AnjoGuard usa apresentação do protótipo e registro de montagem de seus arquivos originais. A imagem disponível de JuriX mostra somente a abertura; a de AdHub mostra sua página de apresentação. As legendas indicam o que cada imagem representa, sem atribuir operações em produção ou resultados comerciais.

## Validação

Testes verificam as seis páginas, semântica, arquivos e links locais, geração reproduzível, seletor com cinco marcas, exclusões e imagens. A revisão visual em navegador nesta sessão não foi realizada: o controle do computador foi interrompido pela ferramenta durante a tentativa anterior.
