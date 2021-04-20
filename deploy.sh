#!/bin/sh
npm run build

if [ -z "$1" ]
then
  echo "Commit message: "
  read var
fi

git add dist && git commit -m $var
git subtree push --prefix dist origin gh-pages