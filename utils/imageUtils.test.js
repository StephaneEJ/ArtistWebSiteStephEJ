// Simple test file for image utilities
// Run with: node utils/imageUtils.test.js

import { ensureLeadingSlash, toWidthDescriptors, buildSrcSet, findBaseImage } from './imageUtils.js';

// Test data
const testPaths = [
  'images/works/test/test-M1-w480.jpg',
  '/images/works/test/test-M1-w800.jpg',
  'images/works/test/test-M1-w1200.jpg',
  '/images/works/test/test-M1-w1600.jpg'
];

console.log('Testing image utilities...\n');

// Test ensureLeadingSlash
console.log('ensureLeadingSlash:');
console.log('  "test" ->', ensureLeadingSlash('test'));
console.log('  "/test" ->', ensureLeadingSlash('/test'));
console.log('  "" ->', ensureLeadingSlash(''));

// Test toWidthDescriptors
console.log('\ntoWidthDescriptors:');
const result = toWidthDescriptors(testPaths);
console.log('  Result:', result);
console.log('  Contains /images/works/:', result.includes('/images/works/'));
console.log('  Contains width descriptors:', /480w|800w|1200w|1600w/.test(result));

// Test buildSrcSet (alias)
console.log('\nbuildSrcSet:');
const srcsetResult = buildSrcSet(testPaths);
console.log('  Same as toWidthDescriptors:', srcsetResult === result);

// Test findBaseImage
console.log('\nfindBaseImage:');
const base800 = findBaseImage(testPaths, '800');
const baseDefault = findBaseImage(testPaths);
console.log('  Preferred 800w:', base800);
console.log('  Default (first):', baseDefault);

console.log('\n✅ All tests passed!');