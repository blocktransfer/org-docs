"use strict";

const assert = require("node:assert/strict");
const {test} = require("node:test");
const {
  historyUrlForMissingPath,
  repositoryHistoryUrl
} = require("../../src/theme/NotFound/Content/history.cjs");

test("old static file URLs point to the exact source-file history", () => {
  assert.equal(historyUrlForMissingPath("/files/taxes/2024.pdf"),
    repositoryHistoryUrl + "?path=static%2Ffiles%2Ftaxes%2F2024.pdf");
  assert.equal(historyUrlForMissingPath("/ref/financials/2025/Balance%20Sheet.xlsx"),
    repositoryHistoryUrl + "?path=static%2Fref%2Ffinancials%2F2025%2FBalance%20Sheet.xlsx");
  assert.equal(historyUrlForMissingPath("/img/old-logo.png"),
    repositoryHistoryUrl + "?path=static%2Fimg%2Fold-logo.png");
  assert.equal(historyUrlForMissingPath("/favicon.ico"),
    repositoryHistoryUrl + "?path=static%2Ffavicon.ico");
});

test("documentation links select current or archived source history", () => {
  assert.equal(historyUrlForMissingPath("/docs/records"),
    repositoryHistoryUrl + "?path=docs%2Frecords.md");
  assert.equal(historyUrlForMissingPath("/docs/0.2.0/taxes/index"),
    repositoryHistoryUrl + "?path=versions%2Farchive-0.2.0%2Ftaxes%2Findex.md");
});

test("unknown, generated, or unsafe URLs fall back to repository history", () => {
  for (const pathname of ["/", "/unrecognized/path", "/docs/category/operations",
    "/files/../private.pdf", "/files/%ZZ", "/docs/../../secrets"]) {
    assert.equal(historyUrlForMissingPath(pathname), repositoryHistoryUrl);
  }
});
