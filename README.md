# Monocli

[![GitHub package.json version](https://img.shields.io/github/package-json/v/noelmace/monocli)](https://github.com/noelmace/monocli/blob/master/CHANGELOG.md) ![npm](https://img.shields.io/npm/l/@monocli/cli) ![typescript](https://img.shields.io/npm/types/@monocli/cli) [![package](https://img.shields.io/npm/v/@monocli/cli)](https://www.npmjs.com/package/@monocli/cli)

<p align="center">
  <img src="/logo.png" alt="monocli logo" height="130"/>
</p>

<p align="center">One CLI to rule them all</p>

## Quick Start

```shell-session
$ npm install --global @monocli/cli

$ monocli help
```

## Principles

`monocli` is a very simple "Meta" CLI, easing advanced usage of commonly used command line tools.

Its first goal is to help you manage your monorepos without requiring any other tool. But it's more than that!

It aim to be as **generic**, **light**, **efficient** and **simple** as possible.

1. **No need to reinvent the wheel**: `monocli` simply run other commands with some tricks and hacks, that it!
2. **Keep your freedom**: you can always use other CLIs alongside `monocli`
3. **Learn from the bests**: `monocli` helps you learn and follow good practices and conventions

`monocli` is still in an early phase of development. New [PR](https://github.com/noelmace/monocli/fork), [bug reports and feature requests](https://github.com/noelmace/monocli/issues/new/choose) are more than welcome.

## Commands

```shell-session
$ monocli <command> <params> [options]
```

Run `monocli help` and `monocli help <command>` for more information.

### Generics

- `help`: display usage info

### GIT

Use subtrees and follow [conventionnal commits](https://www.conventionalcommits.org) with ease.

#### add

Add, convert or import a "subproject" in a monorepo.

##### example

Convert the `packages/awesome` submodule to a subtree and add the `awesome` scope to all commit messages:

```
monocli add ./packages/awesome --scope awesome --rewrite
```

#### check

Check if a directory has changed since a given release.

> This command is particularly useful for CI and incremental builds.

##### example

Build a project only if it changed since the last release:

```
monocli check packages/awesome && ./build-awesome
```

#### spush

Push new subtree commits *to* a remote repository.

##### example

```
monocli spush packages/awesome git@github.com:me/awesome.git
```

#### spull

Pull new subtree commits *from* a remote repository, and merge them to the current branch

##### example

```
monocli spull packages/awesome git@github.com:me/awesome.git
```

#### update

Update (push) the subtree associated to `<directory>`

> alias of spush with `--force` and `--branch=master` options

##### example

```
monocli update packages/awesome git@github.com:me/awesome.git
```

#### mv

Change a subtree prefix

##### example

```
monocli mv packages/awesome projects/awesome
```

#### rm

Delete a subproject

```
monocli rm <path>
```

#### Status

Show the monorepo status

:construction: Work in progress

```
monocli status
```

### And more to come...
