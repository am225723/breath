# The Path of Embers - Deployment Guide

## 🔥 Application Overview

**The Path of Embers** is a fully functional Dark Souls-inspired breathing and meditation application built with React, TypeScript, and Vite.

## ✅ Completed Features

### Core Systems
- ✅ Four breathing techniques (4-7-8, Box Breathing, Wim Hof, Resonance)
- ✅ Soul Ember visualizer with particle effects
- ✅ Bonfire progression system (4 levels)
- ✅ Daily streak tracking with grace period
- ✅ Covenant system with UI theming

### Visual Features
- ✅ Dynamic particle background that responds to breathing
- ✅ Reactive Soul Ember that changes with breath phases
- ✅ Chronicler's Map constellation visualization
- ✅ Bonfire level progression visuals

### Data & Integration
- ✅ Pre-ritual journaling prompts
- ✅ Post-ritual reflection prompts
- ✅ Local storage for all data
- ✅ Session history tracking

### Community Features
- ✅ Echoes of Travelers message system
- ✅ Anonymous message sharing
- ✅ Pre-set supportive message templates

### Audio & Immersion
- ✅ Optional voice narration
- ✅ Breathing phase guidance
- ✅ Dynamic background particles

### UI/UX
- ✅ Responsive design
- ✅ Dark fantasy aesthetic
- ✅ Covenant-based theming
- ✅ Info/About panel
- ✅ Comprehensive user guide

## 🚀 Running the Application

### Development Mode
```bash
cd path-of-embers
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

The production files will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## 📦 Deployment Options

### Option 1: Static Hosting (Recommended)
The application is a static site and can be deployed to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Push to gh-pages branch
- **AWS S3**: Upload dist folder to S3 bucket
- **Any static host**: Upload the `dist` folder

### Option 2: Self-Hosting
1. Build the production version: `npm run build`
2. Serve the `dist` folder with any web server:
   - Nginx
   - Apache
   - Node.js (using `serve` package)

### Option 3: Docker
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔒 Privacy & Data

- **100% Client-Side**: All data stored in browser's localStorage
- **No Backend Required**: No server, no database, no API calls
- **No Tracking**: No analytics, no cookies, no external requests
- **Offline Capable**: Works without internet after initial load

## 📊 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- JavaScript enabled
- localStorage support
- Canvas API support
- Web Speech API (optional, for voice narration)

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
- `ember` colors: Main accent colors
- `bonfire` colors: Secondary accent colors
- `ash` colors: Background and text colors

### Breathing Techniques
Edit `src/data/breathingRites.ts` to:
- Modify existing techniques
- Add new breathing patterns
- Adjust timing and instructions

### Covenants
Edit `src/data/covenants.ts` to:
- Change covenant themes
- Modify UI tints
- Adjust preferred techniques

## 📱 Mobile Optimization

The app is fully responsive and works on:
- Phones (portrait and landscape)
- Tablets
- Desktop screens

## 🐛 Known Limitations

1. **Voice Narration**: Quality depends on browser's text-to-speech engine
2. **Particle Effects**: May be less smooth on older devices
3. **localStorage Limit**: ~5-10MB (sufficient for years of data)

## 🔮 Future Enhancements

Potential additions (not yet implemented):
- Ambient soundscapes (ocean, forest, etc.)
- "The Forge" automotive audio mode
- Export journal entries to PDF
- Custom ember colors for First Flame level
- Progressive Web App (PWA) support
- Mobile app versions

## 📄 License

This is an open-source project. Feel free to modify and distribute.

## 🆘 Support

For issues or questions:
1. Check browser console for errors
2. Verify JavaScript is enabled
3. Try clearing browser cache
4. Test in a different browser

## 🎮 Quick Start Guide

1. **First Visit**: Choose your Covenant
2. **Select a Rite**: Pick a breathing technique
3. **Journal (Optional)**: Note what brings you to practice
4. **Breathe**: Follow the visual guidance
5. **Reflect (Optional)**: Note any insights
6. **Build Your Streak**: Practice daily to level up your bonfire

---

**The flame awaits, traveler.**

*Don't give up, skeleton.*