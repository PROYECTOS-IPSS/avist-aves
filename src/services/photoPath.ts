const SAFE_EXTENSIONS: Record<string, true> = { jpg: true, jpeg: true, png: true, webp: true };

export function safePhotoExtension(uri: string): string {
  const path = uri.split(/[?#]/, 1)[0];
  const match = /\.([a-z0-9]{1,5})$/i.exec(path);
  const extension = match?.[1].toLowerCase();

  return extension && SAFE_EXTENSIONS[extension] ? extension : 'jpg';
}

export function createDraftPhotoFilename(
  sourceUri: string,
  uniqueId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
): string {
  return `photo-${uniqueId}.${safePhotoExtension(sourceUri)}`;
}

export function isOwnedPhotoPath(uri: string, directoryUri: string): boolean {
  const prefix = directoryUri.replace(/\/+$/, '') + '/';
  const relativePath = uri.startsWith(prefix) ? uri.slice(prefix.length) : '';

  return (
    relativePath.length > 0 &&
    !relativePath.includes('/') &&
    /^photo-[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(relativePath)
  );
}
