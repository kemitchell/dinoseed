var path = require('path');
var fs = require('fs');
var metalsmith = require('metalsmith');
var prompt = require('metalsmith-prompt');
var templates = require('metalsmith-templates');

var argv = require('yargs')
  .usage("usage: $0 -d <directory> -s <seed name>")
  .demand(['d', 's'])
  .argv;

var dir = argv.d;
if (!dir) {
  console.log("directory not given!");
  console.log(usage);
  process.exit(1);
}

var seedName = argv.s;
if (!seedName) {
  console.log("seed name not given!");
  console.log(usage);
  process.exit(1);
}

var seedPath = "./" + seedName;
var seed;

try {
  seed = require(seedPath + '.json');
} catch (err) {
  console.log("seed does not exist!");
  console.log(usage);
  process.exit(2);
}

var cwd = process.cwd();
var cwdRelative = path.relative(__dirname, cwd);
var dirRelative = path.join(cwdRelative, dir);

metalsmith(__dirname)
  .source(seedPath)
  .destination(dirRelative)
  .use(prompt(seed.prompt))
  .use(templates(seed.templates))
  .build(function (err) {
    if (err) { throw err; }
    
    var dotgitPath = path.join(cwd, dir, ".git");
    fs.unlinkSync(dotgitPath);
  });
