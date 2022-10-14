module.exports = function findBadLineBreaks(filepath, links) {
  let results = [];
  let includeSemver = false;
  links.forEach(function (link) {
    includeSemver = (/v\d+.\d+.\d+/).test(link);
    if (link.includes('guides.emberjs.com/') && !includeSemver) {
      results.push({ fileToFix: filepath, makeThisARelativePath: link });
    }
  });
  return results;
};
