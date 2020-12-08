const util = require("util");
const os = require("os");
const { exec } = require("child_process");
const execAsync = util.promisify(exec);
const {
  parse,
  addDays,
  addYears,
  isWeekend,
  setHours,
  setMinutes
} = require("date-fns");
const chalk = require("chalk");
const ora = require("ora");
const boxen = require("boxen");

let firstCommit = true;

async function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = function(props) {
  const filename = "foo.txt";

  const commitDateList = generateCommitDateList({
    workdaysOnly: props.workdaysOnly,
    commitsPerDay: props.commitsPerDay.split(","),
    startDate: props.startDate
      ? parse(props.startDate)
      : addYears(new Date(), -1),
    endDate: props.endDate ? parse(props.endDate) : new Date()
  });

  (async function generateHistory() {
    const spinner = ora("Generating your GitHub activity\n").start();

    const command = commitDateList
      .map(date => {
        if (firstCommit) {
          firstCommit = false;
          return addLines(date, filename);
        } else {
          return randomCommitActivity()(date, filename);
        }
      })
      .join(";");
    await execAsync(command);
    spinner.succeed();

    console.log(
      boxen(
        `${chalk.green("Success")} ${
          commitDateList.length
        } commits have been created.
      If you rely on this tool, please consider buying me a cup of coffee. I would appreciate it
      ${chalk.blueBright("https://www.buymeacoffee.com/artiebits")}`,
        { borderColor: "yellow", padding: 1, align: "center" }
      )
    );
  })();

  /**
   * Executes a shell command and return it as a Promise.
   * @param cmd {string}
   * @return {Promise<string>}
   */
  function execShellCommand(cmd) {
    const exec = require("child_process").exec;
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  }

  function generateCommitDateList({
    commitsPerDay,
    workdaysOnly,
    startDate,
    endDate
  }) {
    const commitDateList = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      if (workdaysOnly && isWeekend(currentDate)) {
        currentDate = addDays(currentDate, 1);
        continue;
      }
      for (let i = 0; i < getRandomIntInclusive(...commitsPerDay); i++) {
        const dateWithHours = setHours(
          currentDate,
          getRandomIntInclusive(9, 16)
        );
        const commitDate = setMinutes(
          dateWithHours,
          getRandomIntInclusive(0, 59)
        );
        commitDateList.push(commitDate);
      }
      currentDate = addDays(currentDate, 1);
    }

    return commitDateList;
  }
};

function randomLOCNum() {
  return Math.floor(Math.random() * Math.floor(100));
}

function addLines(date, filename) {
  const lines = randomLOCNum();
  return `for i in {1..${lines}}; do echo "${date}" >> ${filename}; done; git add .; git commit --date "${date}" -m "fake commit"`;
}

function removeLines(date, filename) {
  const lines = randomLOCNum();
  return `for i in {1..${lines}}; do sed -i "1d" ${filename}; done; git add .; git commit --date "${date}" -m "fake commit"`;
}

function modifyLines(date, filename) {
  const lines = randomLOCNum();
  return `for i in {1..${lines}}; do sed -i "$i\s/.*/modified-line/" ${filename}; done; git add .; git commit --date "${date}" -m "fake commit"`;
}

function randomCommitActivity() {
  const commitActions = [addLines, removeLines, modifyLines];
  return commitActions[Math.floor(Math.random() * commitActions.length)];
}
