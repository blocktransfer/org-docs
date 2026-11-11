"use strict";

const repositoryHistoryUrl = "https://github.com/blocktransfer/org-docs/commits/main";

function historyUrlForMissingPath(pathname) {
  if (typeof pathname !== "string") return repositoryHistoryUrl;

  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return repositoryHistoryUrl;
  }

  const parts = decoded.replace(/^\/+|\/+$/g, "").split("/");
  if (parts.some(part => !part || part === "." || part === "..")) {
    return repositoryHistoryUrl;
  }

  let sourcePath;
  if (parts[0] === "docs" && parts.length > 1) {
    if (parts[1] === "category") return repositoryHistoryUrl;
    if (/^\d+\.\d+\.\d+$/.test(parts[1]) && parts.length > 2) {
      sourcePath = "versions/archive-" + parts[1] + "/" + parts.slice(2).join("/");
    } else {
      sourcePath = "docs/" + parts.slice(1).join("/");
    }
    if (!/\.(?:md|mdx)$/i.test(sourcePath)) sourcePath += ".md";
  } else if (["files", "ref", "img"].includes(parts[0]) ||
             (parts.length === 1 && /\.[A-Za-z0-9]+$/.test(parts[0]))) {
    sourcePath = "static/" + parts.join("/");
  } else {
    return repositoryHistoryUrl;
  }

  return repositoryHistoryUrl + "?path=" + encodeURIComponent(sourcePath);
}

module.exports = {historyUrlForMissingPath, repositoryHistoryUrl};
