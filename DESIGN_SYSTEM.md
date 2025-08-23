# Design System - EF CMS

## 🎨 **Typography: Metropolis Font Family**

### **Font Weights**
- **Light (300)**: `font-light` - For subtle text and captions
- **Regular (400)**: `font-normal` - Default body text
- **SemiBold (600)**: `font-semibold` - Subheadings and emphasis
- **Bold (700)**: `font-bold` - Main headings and strong emphasis

### **Usage Examples**
```tsx
// Headings
<h1 className="font-metropolis font-bold text-title text-3xl">Main Title</h1>
<h2 className="font-metropolis font-semibold text-title text-2xl">Section Title</h2>
<h3 className="font-metropolis font-semibold text-title text-xl">Subsection</h3>

// Body text
<p className="font-metropolis font-normal text-text text-base">Regular paragraph text</p>
<p className="font-metropolis font-light text-text text-sm">Subtle caption text</p>

// Buttons
<button className="font-metropolis font-semibold bg-button text-button-text px-4 py-2 rounded">
  Action Button
</button>
```

## 🌈 **Color Palette**

### **Primary Colors**
| Color Name | Hex Code | Tailwind Class | Usage |
|------------|----------|----------------|-------|
| **Title** | `#0D141C` | `text-title`, `bg-title` | Titles, icons (sidebar) |
| **Text** | `#4A739C` | `text-text` | Main text color |
| **Button** | `#5A6F80` | `bg-button` | Primary button background |
| **Button Delete** | `#F43F5E` | `bg-button-delete` | Delete/danger buttons |
| **Stroke** | `#CFDBE8` | `border-stroke` | Table borders, card borders |
| **Button Text** | `#FFFDF6` | `text-button-text` | Text color on buttons |
| **Background** | `#F7FAFC` | `bg-page` | Page backgrounds |

### **Color Usage Examples**
```tsx
// Text colors
<h1 className="text-title">Page Title</h1>
<p className="text-text">Body paragraph</p>

// Backgrounds
<div className="bg-page">Page content</div>
<button className="bg-button text-button-text">Primary Button</button>

// Borders
<table className="border-stroke">Table with custom borders</table>
<div className="border border-stroke">Card with stroke border</div>

// Delete actions
<button className="bg-button-delete text-button-text">Delete Item</button>
```

## 🎯 **Component Examples**

### **Button Components**
```tsx
// Primary Button
<button className="font-metropolis font-semibold bg-button text-button-text px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
  Save Changes
</button>

// Delete Button
<button className="font-metropolis font-semibold bg-button-delete text-button-text px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
  Delete Item
</button>

// Secondary Button
<button className="font-metropolis font-normal border border-stroke text-text px-6 py-3 rounded-lg hover:bg-stroke/20 transition-colors">
  Cancel
</button>
```

### **Card Components**
```tsx
// Content Card
<div className="bg-white border border-stroke rounded-lg p-6 shadow-sm">
  <h3 className="font-metropolis font-semibold text-title text-lg mb-3">Card Title</h3>
  <p className="font-metropolis font-normal text-text">Card content goes here...</p>
</div>

// Stats Card
<div className="bg-white border border-stroke rounded-lg p-6">
  <div className="flex items-center">
    <div className="p-3 bg-button/10 rounded-lg">
      <Icon className="w-6 h-6 text-button" />
    </div>
    <div className="ml-4">
      <p className="font-metropolis font-normal text-text text-sm">Total Users</p>
      <p className="font-metropolis font-bold text-title text-2xl">1,234</p>
    </div>
  </div>
</div>
```

### **Form Components**
```tsx
// Input Field
<div className="space-y-2">
  <label className="font-metropolis font-semibold text-title text-sm">
    Email Address
  </label>
  <input
    type="email"
    className="font-metropolis font-normal w-full px-4 py-3 border border-stroke rounded-lg text-text placeholder:text-text/60 focus:outline-none focus:ring-2 focus:ring-button/20 focus:border-button"
    placeholder="Enter your email"
  />
</div>

// Form Section
<div className="space-y-6">
  <h2 className="font-metropolis font-bold text-title text-xl">Personal Information</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Form fields */}
  </div>
</div>
```

## 📱 **Layout & Spacing**

### **Page Structure**
```tsx
// Main page layout
<div className="min-h-screen bg-page">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Page content */}
  </div>
</div>

// Dashboard layout
<div className="flex h-screen bg-page">
  <Sidebar className="w-64 bg-white border-r border-stroke" />
  <main className="flex-1 overflow-auto">
    <Header className="bg-white border-b border-stroke" />
    <div className="p-6">
      {/* Dashboard content */}
    </div>
  </main>
</div>
```

### **Spacing System**
```tsx
// Consistent spacing
<div className="space-y-6">        {/* Vertical spacing between elements */}
<div className="space-x-4">        {/* Horizontal spacing between elements */}
<div className="p-6">              {/* Padding inside containers */}
<div className="px-4 py-3">        {/* Specific padding values */}
<div className="mt-8 mb-6">        {/* Specific margin values */}
```

## 🔧 **Tailwind Configuration**

Your `tailwind.config.ts` now includes:

```typescript
theme: {
  extend: {
    fontFamily: {
      'metropolis': ['Metropolis', 'sans-serif'],
    },
    fontWeight: {
      'light': '300',
      'normal': '400',
      'semibold': '600',
      'bold': '700',
    },
    colors: {
      'title': '#0D141C',
      'text': '#4A739C',
      'button': '#5A6F80',
      'button-delete': '#F43F5E',
      'stroke': '#CFDBE8',
      'button-text': '#FFFDF6',
      'background': '#F7FAFC',
    },
  },
}
```

## 📋 **Quick Reference**

### **Common Classes**
```tsx
// Typography
font-metropolis font-light    // Light text
font-metropolis font-normal   // Regular text
font-metropolis font-semibold // Semi-bold text
font-metropolis font-bold     // Bold text

// Colors
text-title        // #0D141C - Titles
text-text         // #4A739C - Body text
text-button-text  // #FFFDF6 - Button text
bg-page           // #F7FAFC - Page background
bg-button         // #5A6F80 - Button background
bg-button-delete  // #F43F5E - Delete button
border-stroke     // #CFDBE8 - Borders
```

### **Component Patterns**
```tsx
// Page header
<div className="mb-8">
  <h1 className="font-metropolis font-bold text-title text-3xl">Page Title</h1>
  <p className="font-metropolis font-normal text-text mt-2">Page description</p>
</div>

// Content section
<div className="bg-white border border-stroke rounded-lg p-6">
  <h2 className="font-metropolis font-semibold text-title text-xl mb-4">Section Title</h2>
  {/* Section content */}
</div>
```

## 🚀 **Next Steps**

1. **Add Metropolis font files** to `/public/fonts/` directory
2. **Update existing components** to use the new design system
3. **Create reusable component library** with consistent styling
4. **Implement your Figma design** using these exact colors and typography

The design system is now ready! You can use these classes throughout your CMS for consistent, professional styling. 🎯
