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

SOURCE_DIR=`pwd`/src
ROOT_DIR=`pwd`
BUILD_DIR=`pwd`/build


# remove any left-over files from previous build
rm -f $APP_NAME.xpi
rm -rf $BUILD_DIR

# Running commands before building
$BEFORE_BUILD

mkdir --parents --verbose $BUILD_DIR

# generate the XPI file
echo "Generating $APP_NAME.xpi..."
cd $SOURCE_DIR

zip -r $BUILD_DIR/$APP_NAME.xpi *

cd "$ROOT_DIR"

# Runing commads after building
$AFTER_BUILD

echo "Done!"
