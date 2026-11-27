"use strict";

const assert = require("node:assert/strict");
const {test} = require("node:test");
const remarkArchivedAssets = require("../../scripts/remark-archived-assets.cjs");

function run(file, nodes) {
  const tree = {type: "root", children: nodes};
  remarkArchivedAssets()(tree, {path: file});
  return tree.children;
}

test("archived static file links bypass Webpack resolution", () => {
  const nodes = [
    {type: "paragraph", children: [
      {type: "link", url: "/files/taxes/2024.pdf", children: [{type: "text", value: "2024"}]},
      {type: "link", url: "/files/financials/2025/Balance%20Sheet.xlsx", children: []},
      {type: "link", url: "/files/financials/2025/xlm-deposits.csv#data", children: []},
      {type: "image", url: "/img/old.png", alt: "Old"},
      {type: "link", url: "pathname:///files/already.pdf", children: []},
      {type: "link", url: "/docs/records", children: []},
      {type: "link", url: "../other.md", children: []},
      {type: "link", url: "https://example.com/file.pdf", children: []},
      {type: "link", url: "//example.com/file.pdf", children: []}
    ]},
    {type: "definition", identifier: "file", url: "/files/taxes/2025.pdf"},
    {type: "code", value: "[unprocessed](/files/taxes/2025.pdf)"}
  ];
  const result = run("/repo/versioned_docs/version-0.2.0/records.md", nodes);
  assert.deepEqual(result[0].children.map(x => x.url), [
    "pathname:///files/taxes/2024.pdf",
    "pathname:///files/financials/2025/Balance%20Sheet.xlsx",
    "pathname:///files/financials/2025/xlm-deposits.csv#data",
    "pathname:///img/old.png",
    "pathname:///files/already.pdf",
    "/docs/records",
    "../other.md",
    "https://example.com/file.pdf",
    "//example.com/file.pdf"
  ]);
  assert.equal(result[1].url, "pathname:///files/taxes/2025.pdf");
  assert.match(result[2].value, /\/files\/taxes/);
});

test("current documents retain strict static-file validation", () => {
  const result = run("/repo/docs/records.md", [
    {type: "link", url: "/files/missing.pdf", children: []}
  ]);
  assert.equal(result[0].url, "/files/missing.pdf");
});

test("archive detection supports Windows paths but not similar paths", () => {
  const node = () => ({type: "link", url: "/ref/files/missing.pdf", children: []});
  assert.equal(run("C:\\repo\\versioned_docs\\version-0.1.0\\taxes\\index.md", [node()])[0].url,
    "pathname:///ref/files/missing.pdf");
  assert.equal(run("/repo/my-versioned_docs/version-1/test.md", [node()])[0].url,
    "/ref/files/missing.pdf");
});
