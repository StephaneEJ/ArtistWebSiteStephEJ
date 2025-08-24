# Image Guidelines for Artwork

## ❌ NEVER DO - Fixed Heights
```css
/* DON'T: Fixed heights on artwork images */
.card img { height: 240px; }
.artwork { max-height: 200px; }
img { h-60; } /* Tailwind fixed height */
```

## ✅ ALWAYS DO - Aspect Ratio Wrappers
```jsx
// DO: Use aspect ratio wrappers
<div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
  <img className="absolute inset-0 w-full h-full object-cover" />
</div>

// DO: For carousel stages
<div className="relative w-full max-w-screen-lg mx-auto aspect-[3/4] md:aspect-[4/5]">
  <img className="absolute inset-0 w-full h-full object-contain" />
</div>
```

## Best Practices

1. **Use aspect ratio containers** instead of fixed heights
2. **Position images absolutely** within their containers
3. **Use object-cover** for cards (crops to fit)
4. **Use object-contain** for carousel stages (shows full image)
5. **Ensure absolute paths** for all image sources
6. **Include width descriptors** in srcsets

## Unit Test Comment
```css
/* Never use fixed heights on artwork images; use aspect wrappers instead. */
```

## Components to Check
- ✅ WorkCard - Uses aspect wrapper
- ✅ ProductCarousel - Uses aspect wrapper  
- ✅ ResponsiveImage - Uses height: auto (correct)
- ✅ Gallery - Uses WorkCard (inherits correct behavior)