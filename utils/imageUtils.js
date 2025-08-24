/**
 * Ensures a path starts with a leading slash
 * @param {string} path - The path to normalize
 * @returns {string} - Path with leading slash
 */
export function ensureLeadingSlash(path) {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Converts an array of image paths to srcset format with width descriptors
 * @param {string[]} srcsetArray - Array of image paths
 * @returns {string} - Formatted srcset string
 */
export function toWidthDescriptors(srcsetArray) {
  if (!Array.isArray(srcsetArray)) return '';
  
  return srcsetArray
    .map(src => {
      const absolutePath = ensureLeadingSlash(src);
      const widthMatch = src.match(/-w(\d+)\./);
      const width = widthMatch ? widthMatch[1] : '';
      return width ? `${absolutePath} ${width}w` : absolutePath;
    })
    .filter(Boolean)
    .join(', ');
}

/**
 * Builds a complete srcset with proper formatting
 * @param {string[]} srcsetArray - Array of image paths
 * @returns {string} - Formatted srcset string
 */
export function buildSrcSet(srcsetArray) {
  return toWidthDescriptors(srcsetArray);
}

/**
 * Finds the best base image from a srcset array
 * @param {string[]} srcsetArray - Array of image paths
 * @param {string} preferredWidth - Preferred width (e.g., '800')
 * @returns {string} - Best base image path
 */
export function findBaseImage(srcsetArray, preferredWidth = '800') {
  if (!Array.isArray(srcsetArray) || srcsetArray.length === 0) return '';
  
  // Try to find the preferred width first
  const preferred = srcsetArray.find(src => new RegExp(`-w${preferredWidth}\\.`).test(src));
  if (preferred) return ensureLeadingSlash(preferred);
  
  // Fallback to first available
  return ensureLeadingSlash(srcsetArray[0]);
}