#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const { runLoaders  } = require('loader-runner');

if (process.argv.length < 4) {
  usage();
  process.exit(1);
}

const loaders = process.argv.slice(2, process.argv.length - 1)
  .map(loader => ({
    name: loader,
    path: path.join(process.cwd(), 'node_modules', loader)
  }))
const file = process.argv[process.argv.length - 1]

loaders.forEach(loader => {
  try {
    require(loader.path)
  } catch (e) {
    console.warn(`Loader ${loader.name} is not installed`);
    process.exit(1);
  }
})

if (!fs.existsSync(file)) {
  console.warn(`File ${file} does not exist`);
    process.exit(1);
}

runLoaders({
  resource: path.join(__dirname, file),
  loaders: loaders.map(loader => loader.path),
  readResource: fs.readFile.bind(fs)
}, (err, result) => {
  if (err) {
    console.warn(err);
    return;
  }
  console.log(result.result[0].toString());
})

function usage() {
  console.log('Usage: run-loader loader1 loader2 ... loaderN file');
}
