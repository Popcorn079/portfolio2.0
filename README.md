# Andrew G. Manangan — Developer & Systems Portfolio

A portfolio website crafted for **Andrew G. Manangan**, modeled directly after the design language of [anascode.space](https://www.anascode.space/#hero).

## 🚀 Key Features

- **Design System & Typography**:
  - Heading & Display: `Space Grotesk`
  - Editorial Serif Accents: `Instrument Serif`
  - Handwritten Section Annotations & Arrows: `Caveat`
  - Monospace Data & Badges: `JetBrains Mono`
- **Interactive Mechanical Scrollbar**:
  - Vertical draggable and scroll-reactive track on the right edge with precision tick marks.
- **Floating Capsule Navigation**:
  - Sticky glassmorphic capsule with backdrop-blur, active section tracking, dark/light theme switch, sound toggle, and grid mode toggle.
- **Command Palette (`⌘K` / `Ctrl+K`)**:
  - Spotlight-style modal supporting keyboard navigation, quick section jumps, one-click email copying, GitHub redirection, and theme toggling.
- **Audio Feedback System**:
  - Built-in tactile mechanical clicks synthesized on-the-fly via the Web Audio API (zero audio files needed, fully toggleable).
- **Blueprint Grid & Edge Blurs**:
  - Progressive multi-stop edge blur headers/footers with toggleable blueprint grid background.
- **Live Fortnights / Uptime Counter**:
  - Interactive status pill displaying continuous journey calculation with tooltip explanation.
- **Live GitHub Activity Heatmap**:
  - Interactive contribution matrix and stats linked to [`github.com/Popcorn079`](https://github.com/Popcorn079).
- **Quick Inquiry Form**:
  - Interactive message composer with `⌘ + Enter` sending straight to `andrewmanangan6@gmail.com`.
- **Project Filter System**:
  - Instant category filtering across Software, Automation, and Hardware diagnostics.

---

## 🛠 Tech Stack

- **Languages**: C++, Python, Visual FoxPro, JavaScript (ES6+), SQL, HTML5, CSS3
- **Hardware & Lab**: PC Component Assembly, Hardware Troubleshooting, BIOS/Firmware Setup, Thermal Stress Testing, Network Cabling
- **Productivity & Developer Tools**: VS Code, PowerShell, Git & GitHub, MS Office Suite, Google Docs

---

## 💻 How to View Locally

1. **Direct Browser Launch**:
   - Double-click `index.html` to open it in any modern web browser (Chrome, Edge, Firefox, Brave, Safari).
   - No build step or installation required!

2. **Using a Local Static Server**:
   ```bash
   # Using Node (npx)
   npx serve .
   
   # Or using Python (if installed)
   python -m http.server 3000
   ```

---

## 🌐 Deploy to GitHub Pages (1-Click)

1. Push this folder to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/Popcorn079/portfolio.git
   git push -u origin main
   ```
2. Go to your repository settings on GitHub -> **Pages** -> Select `main` branch -> Click **Save**.
3. Your site will be live instantly!
