"use strict";

const archivePathPattern = /(?:^|[\\/])versioned_docs[\\/]version-[^\\/]+(?:[\\/]|$)/;
const assetUrlPattern = /^\/(?!\/)[^?#]+\.(?:pdf|csv|xlsx?|docx?|pptx?|zip|txt|png|jpe?g|gif|svg|webp|avif)(?:[?#].*)?$/i;

// Keep archived asset URLs as ordinary links, not Webpack imports. A missing
// historical file may return 404 without preventing newer docs from building.
function remarkArchivedAssets() {
  return (tree, file) => {
    if (!archivePathPattern.test(file?.path ?? "")) return;

    function visit(node) {
      if (!node || typeof node !== "object") return;
      if (["link", "image", "definition"].includes(node.type) &&
          typeof node.url === "string" && assetUrlPattern.test(node.url)) {
        node.url = "pathname://" + node.url;
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    }

    visit(tree);
  };
}

module.exports = remarkArchivedAssets;
