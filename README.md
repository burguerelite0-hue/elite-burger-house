# Elite Burger House

Aplicação web da Elite Burger House, construída com Next.js, React, TypeScript, Tailwind CSS, Prisma e MySQL.

## Requisitos

- Node.js 20.9 ou superior
- npm
- MySQL 8+ ou MariaDB compatível
- Uma cópia das variáveis de ambiente

## Instalação

```bash
npm install
copy .env.example .env.local
npm run db:generate
npm run db:validate
```

No macOS/Linux, use `cp .env.example .env.local`.

Preencha `.env.local` com valores reais antes de conectar ao banco. Esse arquivo é ignorado pelo Git.

## Variáveis de ambiente

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Sim para dados reais | Conexão MySQL/MariaDB |
| `AUTH_SECRET` | Sim para o admin | Assinatura da sessão administrativa |
| `ADMIN_EMAIL` | Sim para o admin | E-mail do administrador |
| `ADMIN_PASSWORD_HASH` | Sim para o admin | Hash bcrypt da senha administrativa |

Não coloque senha em texto puro, token ou credencial em arquivos versionados. Para gerar um segredo de sessão:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Para gerar um hash bcrypt localmente, com `bcryptjs` instalado:

```bash
node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA_FORTE', 12))"
```

O valor gerado deve ser colocado somente em `ADMIN_PASSWORD_HASH` no ambiente local ou de produção.

## Desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`.

Rotas principais:

- `/` site público;
- `/checkout` checkout;
- `/admin/login` acesso administrativo;
- `/admin` painel administrativo.

## Banco de dados

O schema está em [prisma/schema.prisma](prisma/schema.prisma). O projeto usa Prisma 7 com adapter MySQL/MariaDB.

Validar o schema:

```bash
npm run db:validate
```

Gerar o client:

```bash
npm run db:generate
```

Criar uma migração durante o desenvolvimento:

```bash
npm run db:migrate -- --name nome_da_migracao
```

Aplicar migrações existentes em produção:

```bash
npm run db:deploy
```

Abrir o Prisma Studio localmente:

```bash
npm run db:studio
```

Nunca execute `db:push` em produção como substituto de migrações. Faça backup do banco antes de aplicar alterações.

## Qualidade e build

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start
```

O build é executado sem banco local quando `DATABASE_URL` não está configurada, exibindo estados vazios. Em produção, a URL real do MySQL deve estar configurada.

## Imagens e URLs

As imagens públicas usam `next/image` e o domínio `images.unsplash.com` configurado em `next.config.ts`. URLs de imagens cadastradas no admin devem usar HTTPS e um host permitido pelo Next Image.

Os links comerciais estão centralizados em [src/config/company.ts](src/config/company.ts). O WhatsApp aponta para `wa.me` e o Instagram para o perfil oficial.

## Segurança

- `.env`, `.env.local` e variantes locais estão no `.gitignore`.
- `.env.example` contém somente placeholders.
- A senha administrativa é comparada com bcrypt.
- A sessão usa cookie `httpOnly`, `sameSite=lax` e assinatura JWT.
- O proxy protege `/admin` e `/api/admin`.
- APIs administrativas validam autenticação antes de operar.
- O checkout recalcula preços, descontos e taxa no servidor.
- Não há credenciais, tokens ou senhas reais no código.

Antes de publicar, revogue qualquer segredo que tenha sido exposto acidentalmente e gere novos valores.

### Auditoria de dependências

`npm audit --omit=dev` atualmente aponta uma vulnerabilidade transitiva em `deepmerge-ts`, trazida pela cadeia de configuração do Prisma 7. O `npm audit fix --force` sugere uma alteração incompatível de versão do Prisma e, por isso, não foi aplicado automaticamente. Revise esse alerta antes da publicação e acompanhe uma correção compatível nas próximas atualizações do Prisma.

## Checklist de produção

- [ ] Criar banco MySQL/MariaDB e usuário com permissões mínimas.
- [ ] Configurar `DATABASE_URL` no ambiente de produção.
- [ ] Gerar `AUTH_SECRET` forte e exclusivo.
- [ ] Configurar `ADMIN_EMAIL`.
- [ ] Gerar e configurar `ADMIN_PASSWORD_HASH` bcrypt.
- [ ] Confirmar que `.env` não aparece no `git status`.
- [ ] Fazer backup do banco.
- [ ] Executar `npm run db:deploy` no servidor.
- [ ] Executar `npm run db:generate` no servidor/build.
- [ ] Executar `npm run lint`.
- [ ] Executar `npx tsc --noEmit`.
- [ ] Executar `npm run build`.
- [ ] Testar login, logout e proteção de `/admin`.
- [ ] Testar catálogo, checkout, cupons e impressão.
- [ ] Conferir URLs de WhatsApp, Instagram e imagens.
- [ ] Configurar domínio e HTTPS.
- [ ] Configurar backups e logs do servidor.
- [ ] Revisar o alerta de dependência do Prisma indicado por `npm audit --omit=dev`.
- [ ] Só então iniciar o processo Node com `npm run start`.

## Preparação para GitHub

1. Crie um repositório privado ou público no GitHub.
2. Na raiz local, confirme que `.env` e `.env.local` estão ignorados:

```bash
git status --ignored
```

3. Revise os arquivos antes do primeiro commit:

```bash
git diff --check
git status
```

4. Não faça commit de `node_modules`, `.next`, `.env`, senhas, dumps ou backups do banco.
5. Faça o primeiro commit somente depois de revisar o checklist.
6. No GitHub, configure branch protection e habilite secret scanning quando disponível.

## Preparação para Hostinger

1. Contrate/crie um banco MySQL no hPanel e anote host, porta, nome, usuário e senha.
2. Crie um aplicativo Node.js no hPanel com Node 20.9+.
3. Envie o repositório sem `.env` ou configure o deploy pelo GitHub.
4. Configure no hPanel as variáveis `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH`.
5. Configure o comando de instalação/build conforme o painel:
   - instalação: `npm ci`;
   - geração Prisma: `npm run db:generate`;
   - migrações: `npm run db:deploy`;
   - build: `npm run build`;
   - inicialização: `npm run start`.
6. Aponte o domínio para o aplicativo e ative SSL/HTTPS.
7. Teste as rotas públicas, `/admin/login`, catálogo, checkout, cupons e impressão.
8. Configure backup periódico do MySQL e monitore logs.

Não publique nem execute o deploy apenas com este README: confirme as opções específicas do plano Hostinger contratado, principalmente suporte a processo Node persistente, versão do Node, comando de inicialização e execução de migrações.

## Status

O projeto está preparado para revisão e publicação, mas nenhum deploy foi executado nesta etapa.
