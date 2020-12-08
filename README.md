# Fake GitHub Commits

A command-line tool to fake your GitHub activity ¯\\_(ツ)_/¯.
Forked from https://github.com/artiebits/fake-git-history

This tool was forked by @github/insights so that we can maintain a version of the tool for populating fake commit history for use in integration testing. See docs [here](https://github.com/github/insights/blob/master/docs/engineering/adrs/adr-172-artificial-data-for-integration-testing.md) for more info.

## How To Use
1. Make sure you have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node.js](https://nodejs.org/en/download/) installed on your machine.
2. Clone down this repo
2. In the direcoty of this repo, create a new repository:
   ```shell script
   mkdir my-history
   cd my-history
   touch foo.txt
   git init
   ```
3. From within the `my-history` directory, generate your commits:
   ```shell script
   node ../src/cli.js --startDate "2020/09/01" --endDate "2020/09/04"
   ```
   It will generate changes to the file for every day within the provided date range. You'll see some output like the following:

   ```
   // ♥ node ../src/cli.js --startDate "2020/09/01" --endDate "2020/09/04"
   ⠋ Generating your GitHub activity
   Adding 15 lines...
   Adding 95 lines...
   Removing 69 lines...
   Adding 36 lines...
   Adding 91 lines...
   Adding 30 lines...
   Removing 81 lines...
   ✔ Generating your GitHub activity

   ┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
   │                                                                                                      │
   │                                 Success 8 commits have been created.                                 │
   │         If you rely on this tool, please consider buying me a cup of coffee. I would appreciate it   │
   │                                   https://www.buymeacoffee.com/artiebits                             │
   │                                                                                                      │
   └──────────────────────────────────────────────────────────────────────────────────────────────────────┘
   ```

   This will result in some git history being generated like the following:

   ```
   [16:34:46] (master) my-history
   // ♥ git log
   commit 1faf416ec3ed4d52eb237ac9fbb9f3193e6ca38c (HEAD -> master)
   Author: SophieDeBenedetto <sophie.debenedetto@gmail.com>
   Date:   Fri Sep 4 15:30:00 2020 -0400

      added 4 lines

   commit 7b4c9ca257374b40b7b65c4deb34229b84914a45
   Author: SophieDeBenedetto <sophie.debenedetto@gmail.com>
   Date:   Fri Sep 4 11:03:00 2020 -0400

      removed 81 lines

   commit 99948f84dbee96f914ade739442ce5991507712f
   Author: SophieDeBenedetto <sophie.debenedetto@gmail.com>
   Date:   Thu Sep 3 12:20:00 2020 -0400

      modified 30 lines

   commit 2d0e1a04dfea7ec7f1191f3ad5f898a55a13f2b0
   Author: SophieDeBenedetto <sophie.debenedetto@gmail.com>
   Date:   Thu Sep 3 10:16:00 2020 -0400

      modified 91 lines

   ...
   ```
4. Push the `my-history` repo to some dummy repo that Insights has set up for the purpose of creating dummy data for integration testing. For example, see [this repo](https://github.com/SophieDeBenedetto/fake-history/commits/main) that had fake generated git history pushed to it.

Done! Go take a look at your GitHub profile 😉

## Customizations

### `--commitsPerDay`

Specify how many commits should be created for every single day.
Default is `0,3` which means it will randomly make from 0 to 3 commits a day. Example:

```shell script
npx fake-git-history --commitsPerDay "0,5"
```

### `--workdaysOnly`

Use it if you don't want to commit on weekends. Example:

```shell script
npx fake-git-history --workdaysOnly
```

### `--startDate` and `--endDate`

By default, the script generates GitHub commits for every day within the last year.
If you want to generate activity for a specific dates, then use these options:

```shell script
npx fake-git-history --startDate "2020/09/01" --endDate "2020/09/30"
```
