const path = require("path");
const fetch = require("node-fetch");

(async function() {
  // 1. max issues in the same fetch is 100 - if you have more you need to fetch again and move through the pages
  // 2. access_token is for private repos. for public ones remove it from the query params
  const accessToken = 'secret';
  const urlToFetch =
    `https://api.github.com/repos/wix-private/wix-base-ui/issues?access_token=${accessToken}&per_page=100`;

  const res = await fetch(urlToFetch);
  const data = await res.json();

  const createCsvWriter = require('csv-writer').createObjectCsvWriter;

  const component = "base-ui";
  const issueType = "Task";
  const reporter = "moshek";

  const finalData = data.map(item => ({
    summary: item.title,
    description: item.body,
    labels: ['dev', ...item.labels.map(label => label.name)],
    component,
    issueType,
    reporter
  }));

  const outputFilePath = path.join(__dirname, './output.csv');
  const csvWriter = createCsvWriter({
    path: outputFilePath,
    header: [
      {id: 'summary', title: 'summary'},
      {id: 'description', title: 'description'},
      {id: 'labels', title: 'labels'},
      {id: 'component', title: 'component'},
      {id: 'issueType', title: 'issueType'},
      {id: 'reporter', title: 'reporter'},
    ]
  });

  csvWriter.writeRecords(finalData)
    .then(() => {
      console.log('...Done');
    });
})();

