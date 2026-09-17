#!/usr/bin/env bash
set -euo pipefail

PROFILE="${1:?Uso: eas-local-build.sh <development|preview>}"

case "$PROFILE" in
  development)
    OUTPUT="build-outputs/development/avistaves-development.apk"
    ;;
  preview)
    OUTPUT="build-outputs/preview/avistaves-preview.apk"
    ;;
  *)
    echo "Perfil no soportado: $PROFILE" >&2
    exit 1
    ;;
esac

CACHE_ROOT="$HOME/.cache/eas-local-builds"

mkdir -p "$CACHE_ROOT"

BUILD_ROOT="$(mktemp -d "$CACHE_ROOT/${PROFILE}-XXXXXX")"
WORKDIR="$BUILD_ROOT/work"
ARTIFACTS="$BUILD_ROOT/artifacts"

# EAS exige que WORKDIR no exista o esté completamente vacío.
mkdir -p "$WORKDIR"
mkdir -p "$ARTIFACTS"

cleanup() {
  rm -rf -- "$BUILD_ROOT"
}

trap cleanup EXIT INT TERM

mkdir -p "$(dirname "$OUTPUT")"
rm -f -- "$OUTPUT"

echo "EAS profile: $PROFILE"
echo "Build root: $BUILD_ROOT"
echo "Workspace temporal: $WORKDIR"
echo "Artifacts temporales: $ARTIFACTS"
echo "Output: $OUTPUT"

EAS_LOCAL_BUILD_WORKINGDIR="$WORKDIR" \
EAS_LOCAL_BUILD_ARTIFACTS_DIR="$ARTIFACTS" \
npx -y eas-cli@24.3.0 build \
  --platform android \
  --profile "$PROFILE" \
  --local \
  --output "$OUTPUT"

echo
echo "Build completada correctamente:"
ls -lh "$OUTPUT"
