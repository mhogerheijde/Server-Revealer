#!/bin/bash
#
# This script will package the Source for this extension into an .xpi file.
#
# Script modified from:
#
# build.sh -- builds JAR and XPI files for mozilla extensions
#   by Nickolay Ponomarev <asqueella@gmail.com>
#   (original version based on Nathan Yergler's build script)
# Most recent version is at <http://kb.mozillazine.org/Bash_build_script>

# This script assumes the following directory structure:
# ./$SOURCE_DIR
#   chrome.manifest
#   install.rdf
#
#   chrome/
#       content/
#       locale/
#       skin/
#
# It uses a temporary directory ./$BUILD_DIR when building; don't use that!
# Script's output is:
# ./$APP_NAME.xpi
#

#
# TODO: Cleanup this code and comments
#

#
# default configuration file is ./config_build.sh, unless another file is 
# specified in command-line. Available config variables:
APP_NAME=          # short-name, jar and xpi files name. Must be lowercase with no spaces
CHROME_PROVIDERS=  # which chrome providers we have (space-separated list)
CLEAN_UP=          # delete the jar / "files" when done?       (1/0)
ROOT_FILES=        # put these files in root of xpi (space separated list of leaf filenames)
ROOT_DIRS=         # ...and these directories       (space separated list)
BEFORE_BUILD=      # run this before building       (bash command)
AFTER_BUILD=       # ...and this after the build    (bash command)
SOURCE_DIR=`pwd`/src
BUILD_DIR=`pwd`/build

#uncomment to debug
#set -x

if [ -z $1 ]; then
  . ./config_build.sh
else
  . $1
fi

if [ -z $APP_NAME ]; then
  echo "You need to create build config file first!"
  echo "Read comments at the beginning of this script for more info."
  exit;
fi

ROOT_DIR=`pwd`


# Running commands before building
$BEFORE_BUILD

if [ ! -d "$BUILD_DIR" ]; then
	mkdir --parents --verbose $BUILD_DIR
fi

# Change into source directory, that is the point of view we want.
cd $SOURCE_DIR

# Fetch the versionnumber from install.rdf
VERSION_NUMBER=`grep "<em:version>.*</em:version>" install.rdf | cut -f2 -d ">" | cut -f1 -d "<"`

APP_FILE=$BUILD_DIR/$APP_NAME-$VERSION_NUMBER.xpi

if [ -z $APP_FILE ]; then
	echo "Removing $APP_FILE..."
	rm $APP_FILE
fi
# generate the XPI file
echo "Generating $APP_FILE..."

# Zip all files in $SOURCE_DIR into the .xpi
zip -r $APP_FILE *

# Back to start
cd "$ROOT_DIR"

# Runing commads after building
$AFTER_BUILD

echo "Done!"
