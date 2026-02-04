# Favicon Generation Instructions

## Overview
This document provides instructions for generating professional favicon files for Alexander Martinez's digital business card.

## Design Specifications
- **Initials**: AM (Alexander Martinez)
- **Background Color**: #F4A32D (Orange - matches digital card)
- **Text Color**: #FFFFFF (White)
- **Font**: Segoe UI, bold
- **Shape**: Circular

## Required Files
1. `favicon.svg` - Vector format (already created)
2. `favicon-16x16.png` - 16x16 pixels
3. `favicon-32x32.png` - 32x32 pixels
4. `apple-touch-icon.png` - 180x180 pixels
5. `favicon.ico` - Multi-size ICO file

## Generation Methods

### Method 1: Using the HTML Generator
1. Open `assets/generate-favicon.html` in a web browser
2. The page will display favicon previews in multiple sizes
3. Click the download buttons to save PNG files
4. Rename the downloaded files to match the required names

### Method 2: Using Online Tools
1. Use favicon.io or similar online favicon generators
2. Upload the SVG file or create using the design specifications
3. Download the generated files
4. Place them in the `assets/` directory

### Method 3: Using Design Software
1. Create a 32x32 pixel canvas
2. Draw a circle with fill color #F4A32D
3. Add "AM" text in white, Segoe UI bold
4. Export as PNG in multiple sizes
5. Convert to ICO format for favicon.ico

## File Placement
All favicon files should be placed in the `assets/` directory:
```
assets/
├── favicon.svg
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── favicon.ico
└── site.webmanifest
```

## Testing
1. Open the digital business card in different browsers
2. Check that the favicon appears in the browser tab
3. Test on mobile devices for Apple touch icon
4. Verify the favicon appears in bookmarks

## Design Consistency
The favicon maintains consistency with the digital card design:
- Same orange color (#F4A32D)
- Same white text color (#FFFFFF)
- Same professional typography
- Clean, minimal design approach
