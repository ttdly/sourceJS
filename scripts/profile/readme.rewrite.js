import { fun as writeWaka } from './waka.writer.js';
import fs from 'fs';
import { graphql } from '@octokit/graphql';

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.argv[2]}`,
  },
});
const titleLen = 25;
let head =
  `<pre>
<strong>Hi, there👋</strong>

You can call me '秃头'
</pre>
`

fs.writeFile('README.md', head, () => { });

async function writeInfo() {
  await something()
  await stats();
  await posts();
}

writeInfo().then(r => console.log(r));

async function something() {
  fs.readFile('data/something.md', { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.log('[SOMETHING]:', err.toString());
    } else {
      fs.appendFile('README.md', data, (err) => {
        if (err) {
          console.log('[SOMETHING]:', err.toString());
        } else {
          console.log('[SOMETHING]:写入成功');
        }
      })
    }
  })
}

async function stats() {
  /**Stats
 * --------------------------------------------------- 
 **/
  let resStats = `<pre>\n🙈 <strong>My GitHub Stats</strong>\n`
  const data = await graphqlWithAuth(`
{
  user(login: "ttdly") {
    name
    login
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
    }
    repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
      totalCount
    }
    pullRequests(first: 1) {
      totalCount
    }
    openIssues: issues(states: OPEN) {
      totalCount
    }
    closedIssues: issues(states: CLOSED) {
      totalCount
    }
    followers {
      totalCount
    }
  }
}
`);

  const totalCommit = String(data.user.contributionsCollection.totalCommitContributions);
  const totalPRs = String(data.user.pullRequests.totalCount);
  const totalIssues = String(data.user.openIssues.totalCount + data.user.closedIssues.totalCount);
  const contributedTo = String(data.user.repositoriesContributedTo.totalCount);
  const titles = ['Total Commits', 'Total PRs', 'Total Issues', 'Contributed to'];
  const infos = [totalCommit, totalPRs, totalIssues, contributedTo];
  for (const i in titles) {
    resStats += `${titles[i].padEnd(titleLen, ' ')}${infos[i].padStart(15, ' ')}\n`
  }
  resStats += `</pre>\n`;
  fs.appendFile('README.md', resStats, (err) => {
    if (err) {
      console.log('[STATS:WRITER]:', err.toString());
    } else {
      console.log('[STATS:WRITER]:写入成功');
    }
  });
}

async function posts() {
  /**Posts
 * --------------------------------------------------- 
 **/
  const baseURL = 'https://blog.152527.xyz/posts/';
  const repo = 'ttdly.github.io';
  const owner = 'ttdly';
  let resPosts = `<pre>\n📰 <strong>Latest Posts</strong>\n`;
  const { repository } = await graphqlWithAuth(`
{
  repository(name: "${repo}", owner: "${owner}") {
    issues(last: 5, states: OPEN) {
      nodes {
        number
        title
        createdAt
      }
    }
  }
}
`);
  repository.issues.nodes.forEach((elem) => {
    let date = new Date(elem.createdAt);
    let dateStr = `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${(date.getDay() + 1).toString().padStart(2, '0')}`;
    resPosts = resPosts + `\n${dateStr} <a href="${baseURL}${elem.number}.html" target="_blank">${elem.title}</a>`
  });
  resPosts += `\n</pre>\n`;
  fs.appendFile('README.md', resPosts, (err) => {
    if (err) {
      console.log('[POSTS:WRITER]:', err.toString());
    } else {
      console.log('[POSTS:WRITER]:写入成功');
    }
  });
  writeWaka()
}