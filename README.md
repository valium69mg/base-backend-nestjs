## HOW TO RUN MIGRATIONS

- 1. uncomment this line below on data-source.ts

```js
migrations: ['src/migrations/*.ts'],
```

- 2. Run this command below

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run --dataSource src/data-source.ts
```

## HOW TO GENERATE A KEY FOR ENCRYPTION

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
