# Contributing

All changes should take place in a separate branch submitted to the master in the form of a _pull request_.

## Steps:

1. Create a new Branch.

```sh
# substitute branchName with whatever suits you
> git checkout -b branchName
```

2. After commiting your changes, rebase to make sure you have the latest changes from the master.

```sh
> git rebase master
```

3. Push your branch to the origin. Git will output a link for creating a _pull request_, visit this link and create it.

```sh
> git push origin branchName
        ...
        ...
remote: Create a pull request for 'branchName' on GitHub by visiting:
remote: https://github.com/zeyad-kay/school-system/pull/branchName/branchName
        ...
        ...
```

4. After your changes had been successfully merged into the master branch, your branch will be deleted at the origin but not locally, so make sure you clean up your local.

```sh
> git branch -D branchName
```

Useful commit messages that describe what you have been working on are greatly appreciated, [here](https://www.conventionalcommits.org/en/v1.0.0/#summary) is a really great guide for writting a helpful commit message.

## Developing

Make sure you update the credentials in the _/src/db/config/db.js_ with yours in a _.env_ file.

1. Install dependencies.

```sh
> npm install
```

2. Create database.

```sh
> npm run db:create
```

3. Migrate database.

```sh
> npm run db:migrate
```

4. Seed database.

```sh
> npm run db:seed
```

To access the database instance, just import the models folder. The models are accessible as properties within the instance. The sequelize instance (ORM) and base class are also accessible as properties.

```js
const db = require("./models");
console.log(Object.keys(db));
// ['Student', 'Father',..., 'sequelize','Sequelize']
```

If you want to have a clean slate, just run:

```sh
# This drops the entire database!
# If you have valuable data don't run it!
> npm run db:clean
```
