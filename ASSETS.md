# Wedding Website Asset Management Guide

## 📁 Directory Structure for Static Assets

I've created the following directory structure in your `public/` folder for organizing all your wedding website assets:

```
public/
├── README.md              # This guide
├── favicon.svg            # Website favicon (already created)
├── images/               # General images
├── logos/                # Logos and branding
│   └── wedding-logo.svg  # Wedding logo (sample created)
├── icons/                # Custom icons and small graphics
└── wedding/              # Wedding-specific content
```

## 🎯 Where to Put Different Asset Types

### **Logos and Branding** → `/public/logos/`
- Wedding couple logos
- Monograms
- Brand identity files
- **Example**: `/public/logos/wedding-logo.svg` (already implemented)

### **Photos and Images** → `/public/images/` or `/public/wedding/`
- Wedding photos: `/public/wedding/`
- Background images: `/public/images/`
- Venue photos: `/public/wedding/`
- General graphics: `/public/images/`

### **Icons** → `/public/icons/`
- Custom UI icons
- Social media icons
- Navigation icons
- Decorative elements

### **Root Level** → `/public/`
- `favicon.ico` or `favicon.svg` (already created)
- `robots.txt`
- `sitemap.xml`
- Other meta files

## 💡 How to Use Assets in Your Code

### **React Components (Recommended)**
```tsx
import Image from 'next/image'

// Wedding logo (already implemented in login.tsx)
<Image 
  src="/logos/wedding-logo.svg" 
  alt="Wedding Logo" 
  width={200} 
  height={80} 
/>

// Wedding photo
<Image 
  src="/wedding/ceremony-venue.jpg" 
  alt="Ceremony Venue" 
  width={800} 
  height={600} 
/>
```

### **Direct References**
```html
<!-- In HTML -->
<img src="/logos/monogram.svg" alt="Wedding Monogram" />

<!-- In CSS -->
background-image: url('/images/wedding-background.jpg');
```

## 🖼️ What I've Already Implemented

1. **Created sample wedding logo**: `/public/logos/wedding-logo.svg`
2. **Added favicon**: `/public/favicon.svg`
3. **Updated login page** to display the wedding logo
4. **Updated landing page** header with the wedding logo
5. **Added favicon to site head** in `_app.tsx`

## 📝 Next Steps for Your Assets

### **Replace Sample Logo**
1. Replace `/public/logos/wedding-logo.svg` with your actual wedding logo
2. Update the width/height props in the Image components if needed

### **Add Your Photos**
```
/public/wedding/
├── hero-photo.jpg          # Main wedding photo for homepage
├── ceremony-venue.jpg      # Ceremony location
├── reception-venue.jpg     # Reception location
├── couple-photo.jpg        # Engagement or couple photo
└── wedding-party/          # Group photos
    ├── bridesmaids.jpg
    └── groomsmen.jpg
```

### **Add Venue Information**
```
/public/wedding/
├── venue-map.png          # Map to venue
├── directions.svg         # Custom directions graphic
└── timeline.png           # Wedding day timeline graphic
```

### **Add Registry Assets**
```
/public/images/
├── registry-amazon.png    # Registry service logos
├── registry-target.png
└── gift-box.svg          # Generic gift icon
```

## 🎨 File Format Recommendations

- **Logos**: SVG (scalable, small file size)
- **Photos**: JPG (compressed for web)
- **Graphics with transparency**: PNG
- **Icons**: SVG preferred, PNG acceptable
- **Favicons**: SVG or ICO

## 📱 Responsive Considerations

The `next/image` component automatically handles:
- ✅ Image optimization
- ✅ Lazy loading
- ✅ Responsive sizing
- ✅ Modern format conversion (WebP, AVIF)

## 🔧 Current Implementation

Your wedding website now includes:
- ✅ Professional wedding logo display
- ✅ Proper favicon configuration
- ✅ Organized asset directory structure
- ✅ Next.js Image optimization
- ✅ Responsive design support

Simply replace the sample assets with your actual wedding materials and update the dimensions as needed!
