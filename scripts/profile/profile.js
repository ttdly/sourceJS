import fs from "fs";
import { graphql } from "@octokit/graphql";
import core from "@actions/core";

const fetcher = graphql.defaults({
  headers: {
    authorization: `token ${process.argv[2]}`,
  },
});

async function run() {
  let readme = "";
  let posts = `\n<pre>\n<strong>近期发布</strong>\n`;
  const baseInfo = fs.readFileSync("base.md", { encoding: "utf-8" });
  const repository = await fetcher(`
  query{
    repository(name: "ttdly.github.io", owner: "ttdly") {
      discussions(first: 5, states: OPEN) {
        nodes {
          title
          number
          createdAt
        }
      }
    }
  }`);
  repository.disscussions.nodes.foreach((elem) => {
    let date = new Date(elem.createdAt);
    let dateStr = `${date.getFullYear()}-${date
      .getMonth()
      .toString()
      .padStart(2, "0")}-${(date.getDay() + 1).toString().padStart(2, "0")}`;
    posts =
      posts +
      `\n${dateStr} <a href="${baseURL}${elem.number}.html" target="_blank">${elem.title}</a>`;
  });
  posts += `\n</pre>\n\n`;
  readme = baseInfo + posts;
  fs.writeFileSync("README.md");
}

try {
  run();
} catch (e) {
  core.setFailed(e);
}
