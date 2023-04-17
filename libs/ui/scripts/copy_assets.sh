#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
REPO_DIR=${SCRIPT_DIR}/../
BUILD_DIR=${1}

cd ${REPO_DIR}/src

function copy_assets() {
  find . -name "*.${1}" | cpio -pdm ${REPO_DIR}/build/${BUILD_DIR}
}

copy_assets css
cp -R assets/svg-icons ${REPO_DIR}/build/${BUILD_DIR}/assets

