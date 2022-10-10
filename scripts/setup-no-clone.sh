#! /bin/sh

cd tmp/guides-source

rm -rf guides

ln -s ../../guides guides

cd public

rm -rf v*

ln -s ../../../website/public/ember-fr ember-fr

cd ../app/components

ln -s ../../../../website/app/components/es-footer-info.hbs es-footer-info.hbs
ln -s ../../../../website/app/components/es-header.hbs es-header.hbs
ln -s ../../../../website/app/components/es-header.js es-header.js

cd ../..

npm install

node node_modules/node-sass/scripts/install.js