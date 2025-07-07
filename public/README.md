# Public Assets Directory

This directory contains all static assets for the wedding website. Files in this directory are served from the root path `/`.

## Directory Structure

### `/public/` - Root Static Assets
- `favicon.ico` - Website favicon
- `robots.txt` - Search engine directives
- `sitemap.xml` - Site structure for search engines

### `/public/images/` - General Images
- Wedding photos
- Background images
- General graphics
- Photo gallery images

### `/public/logos/` - Logos and Branding
- Wedding couple logos
- Monograms
- Brand identity files
- SVG logo files

### `/public/icons/` - Icons and Small Graphics
- Custom icons
- Social media icons
- Navigation icons
- UI element graphics

### `/public/wedding/` - Wedding-Specific Assets
- Venue photos
- Wedding party photos
- Timeline graphics
- Maps and directions
- Registry-related images

## Usage Examples

### In React Components (recommended):
```tsx
import Image from 'next/image'

// Wedding logo
<Image 
  src="/logos/wedding-logo.svg" 
  alt="Wedding Logo" 
  width={200} 
  height={100} 
/>

// Wedding photo
<Image 
  src="/wedding/ceremony-venue.jpg" 
  alt="Wedding Ceremony Venue" 
  width={800} 
  height={600} 
/>
```

### Direct HTML references:
```html
<!-- Favicon -->
<link rel="icon" href="/favicon.ico" />

<!-- SVG logo -->
<img src="/logos/monogram.svg" alt="Wedding Monogram" />

<!-- Background image in CSS -->
background-image: url('/images/wedding-background.jpg');
```

### In CSS files:
```css
.hero-section {
  background-image: url('/images/wedding-background.jpg');
}

.logo {
  content: url('/logos/wedding-logo.svg');
}
```

## File Naming Conventions

- Use lowercase with hyphens: `wedding-logo.svg`
- Be descriptive: `ceremony-venue-photo.jpg`
- Include dimensions for variants: `logo-small-100x50.svg`
- Use appropriate extensions: `.svg` for logos, `.jpg` for photos, `.png` for graphics with transparency

## Recommended File Formats

- **Logos**: SVG (scalable, small file size)
- **Photos**: JPG (compressed, good for photos)
- **Graphics with transparency**: PNG
- **Icons**: SVG or PNG
- **Favicons**: ICO or PNG

## SEO and Performance Notes

- Optimize images before uploading (compress JPGs, optimize SVGs)
- Use descriptive alt text for accessibility
- Consider different sizes for responsive design
- Use Next.js Image component for automatic optimization
