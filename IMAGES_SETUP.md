# 🖼️ **Background Images Setup**

## 📁 **Required Images**

To complete the authentication pages, you need to add the following background images:

### **Background Images Directory:**
```
public/images/backgrounds/
├── login-bg.jpg          # Login page background
├── forgot-bg.jpg         # Forgot password background  
└── configure-bg.jpg      # Password configuration background
```

### **Logo Directory:**
```
public/images/branding/
└── EF_LOGO.png          # Your company logo (✅ IMPLEMENTED)
```

## 🎯 **Image Requirements**

### **Background Images:**
- **Format**: JPG or PNG
- **Resolution**: Minimum 1920x1080 (Full HD)
- **Content**: Community/volunteer activity photos (as shown in your Figma design)
- **Style**: Warm, slightly desaturated tone
- **Size**: Keep under 2MB for optimal performance

### **Current Status:**
- ✅ **Logo**: EF_LOGO.png implemented
- ❌ **Background Images**: Need to be added

## 🚀 **How to Add Images**

1. **Download your background images** from Figma or your design source
2. **Rename them** to match the filenames above
3. **Place them** in the `public/images/backgrounds/` directory
4. **Restart your dev server** if needed

## 🎨 **Design System Integration**

The pages are already implemented with:
- ✅ **Metropolis fonts** (Light, Regular, SemiBold, Bold)
- ✅ **Custom color palette** (#0D141C, #4A739C, #5A6F80, etc.)
- ✅ **Responsive design** using shadcn components
- ✅ **60% black overlay** for text readability
- ✅ **Custom logo component** with your EF_LOGO.png

## 📱 **Pages Available**

- **`/login`** - Login form with email/password
- **`/forgot-password`** - Password recovery form
- **`/configure-password`** - New password setup form

## 🔧 **Next Steps**

1. **Add background images** to the directories above
2. **Test all pages** to ensure proper display
3. **Customize logo** if you want to use your own instead of the SVG
4. **Implement authentication logic** in the form handlers

## 💡 **Tips**

- **Image optimization**: Use tools like TinyPNG to compress images
- **Responsive**: Images will automatically scale for different screen sizes
- **Performance**: Next.js will optimize and serve images efficiently
- **Fallback**: If images fail to load, the overlay will still provide good contrast

Your authentication pages are ready to go once you add the background images! 🎨✨
