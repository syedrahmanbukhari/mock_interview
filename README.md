# Mock Interview Practice Application

A professional mock interview application designed for UK university pre-CAS interviews, featuring passport verification, authentication statements, and comprehensive interview questions.

## Made by
**Syed Rahman Mustafa**

## Features

- 🎥 **Video Recording**: Records interview responses using device camera
- ⏱️ **Timed Questions**: 15-second preparation time + 1-minute recording per question
- 📝 **17 Questions**: Including passport verification, authentication, and UK university interview questions
- 💾 **Auto-Save**: Videos automatically download to local storage
- 📱 **Responsive Design**: Optimized for desktop/laptop use
- 🎨 **Professional UI**: Clean, modern interface matching UCAS Shield design

## Interview Process

1. **Question 1**: Passport ID verification with photo matching
2. **Question 2**: Anti-cheating declaration statement
3. **Questions 3-17**: Comprehensive UK university admission questions covering:
   - University selection and decision-making
   - Financial planning and management
   - Academic goals and learning style
   - Time management and work-life balance
   - Career planning and aspirations

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- MediaRecorder API for video capture
- Local Storage for video downloads

## Getting Started

### Local Development

Simply open `index.html` in a modern web browser (Chrome, Edge, Firefox recommended).

### Deployment on Vercel

1. Install Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

2. Deploy using Vercel CLI:
   ```bash
   vercel
   ```

3. Or deploy via Vercel Dashboard:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the project and deploy

## Browser Requirements

- Modern browser with MediaRecorder API support
- Camera and microphone permissions required
- Recommended: Chrome 60+, Firefox 55+, Edge 79+

## Device Recommendations

For the best experience, use a laptop or desktop PC with:
- Working webcam
- Stable internet connection (for deployment access)
- Quiet environment for recording

## File Structure

```
mock_interview/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── script.js           # Interview logic and video recording
├── vercel.json         # Vercel deployment configuration
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## Privacy & Data

- All video recordings are stored locally on your device
- No data is uploaded to any server
- Videos are automatically downloaded after each question

## License

© 2024 Syed Rahman Mustafa. All rights reserved.

## Support

For issues or questions, please contact the developer.

---

**Note**: This application is designed for practice purposes. For official university interviews, please follow the institution's specific guidelines and platforms.
