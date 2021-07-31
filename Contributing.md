# Contributing

All changes should take place in a separate branch submitted to the master in the form of a *pull request*.

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

3. Push your branch to the origin. Git will output a link for creating a *pull request*, visit this link and create it.

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