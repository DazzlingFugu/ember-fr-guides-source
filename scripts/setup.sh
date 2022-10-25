#! /bin/sh

rm -rf tmp

mkdir -p tmp

cd tmp

git clone https://github.com/ember-learn/guides-source.git --depth 1

cd guides-source

rm -rf guides

ln -s ../../guides guides

cd public

rm -rf v*

cd ..

npm install

node node_modules/node-sass/scripts/install.js
