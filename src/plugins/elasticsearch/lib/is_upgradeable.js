const semver = require('semver');
const utils = require('requirefrom')('src/utils');
const rcVersionRegex = /(\d+\.\d+\.\d+)\-rc(\d+)/i;

module.exports = function (server, doc) {
  const config = server.config();
  if (/beta|snapshot/i.test(doc._id)) return false;
  if (!doc._id) return false;
  // kibi: use kibi version instead of kibana's
  if (doc._id === config.get('pkg.kibiVersion')) return false;

  let packageRcRelease = Infinity;
  let rcRelease = Infinity;
  let packageVersion = config.get('pkg.kibiVersion'); // kibi: use kibi version instead of kibana's
  let version = doc._id;
  const matches = doc._id.match(rcVersionRegex);
  const packageMatches = config.get('pkg.kibiVersion').match(rcVersionRegex); // kibi: use kibi version instead of kibana's

  if (matches) {
    version = matches[1];
    rcRelease = parseInt(matches[2], 10);
  }

  if (packageMatches) {
    packageVersion = packageMatches[1];
    packageRcRelease = parseInt(packageMatches[2], 10);
  }

  try {
    if (semver.gte(version, packageVersion) && rcRelease >= packageRcRelease) return false;
  } catch (e) {
    return false;
  }
  return true;
};
