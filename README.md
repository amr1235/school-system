# School System
A school management system for handling students' affairs, financials, and generating customizable reports and excel exporting.
## Prerequisites

1. [Node.js](https://nodejs.org/en/download/).
2. [PostgreSQL](https://www.postgresql.org/download/).

## Getting Started
Make sure you create a new database called ***School*** and update the credentials in the */src/db/config/db.js* with yours.

1. Install dependencies.

```sh
> npm install
```
2. Migrate database.

```sh
> npm run db:migrate
```
3. Seed database.

```sh
> npm run db:seed
```

4. Start application.

```sh
> npm start
```

5. Build executable (optional).

```sh
> npm run make
```

The executable can be found in the _/out_ folder.

## Contributions
For Contributing check the [Contributing.md](./Contributing.md).