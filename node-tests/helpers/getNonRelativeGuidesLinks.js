// See: https://semver.org
const regSemVer = /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/;

module.exports = function findBadLineBreaks(filepath, links) {
  let results = [];

  links.forEach(function (link) {
    let includeSemver = regSemVer.test(link);
    if (link.includes('guides.emberjs.com/') && !includeSemver) {
      results.push({ fileToFix: filepath, makeThisARelativePath: link });
    }
  });

  return results;
};
