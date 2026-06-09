# Segurança

Este projeto deve ficar sem senhas reais no GitHub.

## Onde guardar segredos

Guarde apenas na Vercel, em Environment Variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `SITE_ACCESS_CODE`
- `SITE_TRIP_ID`
- `ADMIN_PASSWORD_SHA256` opcional
- `PHOTO_REMOVE_PASSWORD_SHA256` opcional
- `ADMIN_SESSION_SECRET` opcional

## Cuidados importantes

- Nao publicar tokens do GitHub.
- Nao publicar chaves `service_role` do Supabase.
- Nao colocar senhas reais no `README.md`, `.env.example`, `index.html` ou `script.js`.
- Manter `.env`, `.env.local`, `.vercel` e `node_modules` fora do Git.
- Se uma senha ou token aparecer publicamente, revogar/trocar o segredo afetado.

## Fotos

O bucket de fotos pode ser publico para as imagens carregarem no navegador. O controle de upload, remocao e restauracao passa pelas APIs da Vercel.
