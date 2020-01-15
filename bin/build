#!/bin/bash
set -e
set -u

PATH="$PATH:node_modules/.bin"
build="build/"
dist="dist/"
app_name="Lax"
electron_icon="icon.icns"

function main {
  rm -rf "$build" "$dist"

  mkdir -p "$build/src/js"
  mkdir -p "$build/src/static"

  # dependencies
  echo "installing production dependencies into $build"
  cp package.json "$build"
  npm install --prefix "$build" --production

  # js
  echo "compiling JS"
  NODE_ENV=production babel src/js --out-dir "$build/src/js"

  # css
  npm run sass -- --output-style compressed

  # static
  echo "copying static files into $build"
  cp src/static/* "$build/src/static"
  cp index.js "$build/index.js"
  grep -v 'babel/register' src/index.html > "$build/src/index.html"

  create_app

  # create .zip
  ditto -c -k --sequesterRsrc --keepParent dist/Lax-darwin-x64/Lax.app dist/Lax.zip
}

function create_app {
  mkdir -p "$dist"
  electron-packager "$build" "$app_name" \
    --icon "$electron_icon" \
    --no-prune \
    --out "$dist"
}

main
