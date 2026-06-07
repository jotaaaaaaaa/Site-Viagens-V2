# Site Viagens

Site de fotos da viagem Madrid, Alicante e Amsterdam, pronto para publicar na Vercel com Supabase salvando curtidas, ordem das fotos e fotos adicionadas.

## O que fica salvo no Supabase

- Fotos adicionadas pelo botao de cada cidade.
- Curtidas/favoritos.
- Ordem das fotos quando alguem arrasta no mural.

Ao abrir direto pelo arquivo `index.html`, o site continua funcionando com salvamento local no navegador. Ao publicar na Vercel e configurar as variaveis, ele passa a sincronizar pelo Supabase.

## Passo a passo

1. Crie um projeto no Supabase.
2. No Supabase, abra o SQL Editor e rode o arquivo `supabase/schema.sql`.
3. No Vercel, importe este repositorio.
4. No Vercel, adicione estas variaveis em Project Settings > Environment Variables:

```txt
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
SUPABASE_STORAGE_BUCKET=site-viagem-fotos
SITE_ACCESS_CODE=gatabrisa
SITE_TRIP_ID=madrid-alicante-amsterdam-2026
```

5. Faca o deploy.
6. Depois de publicado, abra `https://seu-site.vercel.app/api/health`. Se aparecer `ok: true`, a parte do servidor esta configurada.

## Importante

Use a `service_role key` somente nas variaveis da Vercel. Nao coloque essa chave dentro de `script.js`, `index.html` ou qualquer arquivo publico.

O bucket `site-viagem-fotos` fica publico para que as fotos carreguem no site, mas o upload passa pela API da Vercel e exige a senha configurada em `SITE_ACCESS_CODE`.
