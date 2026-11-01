# SWARAJ DATES™
### *The Satyagraha Dating Bureau*
> **Tagline:** *"Find Your Perfect Date. Independence was easier."*

Built with supreme patience for the **Gandhi Hackathon at IIT Bhilai**.

---

## 🏛️ The Pitch & Problem Statement

Modern dating applications like Bumble, Tinder, and Hinge promise instant romantic gratification. But where is the moral character? Where is the character-building agony of civil services paperwork? Where is the non-violent resistance?

**SWARAJ DATES™** combines 1940s colonial-era administrative bureaucracy, Gandhian non-cooperation philosophy, and dating app mechanics into the world's most unnecessarily complicated, yet 100% functional, date picker.

The applicant simply wishes to select a calendar date. However, to achieve chronological self-determination (*Swaraj*), they must navigate:
1. **The Terms and Conditions of the Raj** (unwaivable bureaucracy)
2. **Satya CAPTCHA** (truthfulness verification and birthday oath)
3. **The Swaraj Dating Calendar** (Charkha spinning wheel, 1857–2100 year regulator, Dandi March day advancer, and calendar grid)
4. **The Round Table Conference** (evasive non-cooperation confirm button)
5. **The Salt Tax Clearance** (Section 390 levy of 10 clicks)
6. **The Final Chronological Sanction Certificate** (complete with rubber stamps and printing capability)

---

## 🛠️ Technology Stack

Strictly aligned with the Swadeshi philosophy of software development:
- **HTML5:** Semantic, accessible markup.
- **CSS3:** Custom vintage paper textures, animations, responsive layouts, print stylesheets.
- **Vanilla JavaScript:** Clean modular architecture with zero dependencies.
- **No frameworks:** No React, No Vue, No Angular.
- **No npm / No package.json / No build tools:** Runs directly in any browser and deploys straight to Vercel as a static site.
- **Offline Capable:** Zero external CDN images or scripts. All graphics are pure CSS, Unicode, or inline SVG.

---

## 📂 Project Architecture

```
Worst-ui-practice/
│
├── index.html          # Single-page application markup with 6 bureaucratic stages
├── README.md           # Documentation, pitch, and easter egg guide
│
├── css/
│   └── style.css       # Vintage administrative aesthetic, Charkha & certificate styles
│
└── js/
    ├── copy.js         # Centralized copy, toasts, committee quotes, easter egg messages
    ├── chaos.js        # Satyagraha Chaos Engine: evasive button, salt tax, mercy rule, toasts
    ├── datepicker.js   # Charkha wheel, year slider, Dandi stepper, calendar grid & sync
    └── flow.js         # Stage navigation, captcha validation, certificate generation
```

### Script Execution Order
```html
<script src="js/copy.js"></script>
<script src="js/chaos.js"></script>
<script src="js/datepicker.js"></script>
<script src="js/flow.js"></script>
```

---

## 🌟 Core Features

### 1. The Charkha Month Selector
An interactive spinning wheel featuring a traditional hub, spokes, and 12 months. Users can click to spin, use navigation buttons, or utilize a fallback dropdown for impatient bureaucrats. Tracks rotation count for the final certificate.

### 2. Chronological Year Regulator
An intentionally thin slider spanning **1857 to 2100** (defaulting to **1947**). Supports arrow keys for fine-tuning.

### 3. Dandi March Day Selector
A giant button that advances the date by exactly one day with every click. Commemorates historical milestones such as *12 March 1930* (March begins), *6 April 1930* (Salt Law challenged), and *15 August 1947* (Tryst with Destiny).

### 4. Fully Synchronized Calendar Grid
All 4 controls (Charkha, Year Slider, Dandi Button, and Clickable Calendar Grid) stay in 100% two-way synchronization. Handles leap years flawlessly and rejects invalid combinations (e.g., February 30 or April 31).

### 5. Satyagraha Non-Cooperation Button
During the Round Table Conference, the **CONFIRM MY DATE** button physically evades aggressive mouse movements. To click it, users must demonstrate true *Ahimsa* by hovering calmly over it for 3 seconds, holding for 2 seconds on touch screens, or using the `Enter` / `Space` keyboard keys.

### 6. The 90-Second / 10-Failure Mercy Rule
If a user is stuck for **90 seconds** or fails **10 times**, the prominent banner appears:
> *"BAPU TAKES PITY — COMPLETE YOUR APPLICATION."*
Clicking it immediately bypasses all remaining obstacles and generates the final sanction certificate with their chosen date.

---

## 🕵️ Easter Egg Guide (For Judges & Explorers)

| Trigger | Description |
|---|---|
| **15 August 1947** | *Tryst with destiny™ confirmed.* Special banner and certificate highlight. |
| **26 January** | Constitution Day protocol message. |
| **6 April 1930** | Breaking the salt law — tax automatically waived. |
| **12 March 1930** | Beginning of the Dandi March. |
| **2 October** | Gandhi Jayanti dry day notice. |
| **30 January** | *Martyrs' Day* (strictly respectful commemorative notice). |
| **Header Spectacles** | Click the round glasses in the header **5 times** to activate *Swaraj Vision* sepia mode. |
| **Type "bapu"** | Type `bapu` anywhere on your keyboard for spiritual calm. |
| **Konami Code** | `↑ ↑ ↓ ↓ ← → ← → B A` activates Infinite Moral Endurance. |

---

## 🚀 Running Locally & Deployment

### Run Locally:
No server, compilation, or installation needed!
1. Double-click `index.html` or open it in any modern browser (Chrome, Firefox, Safari, Edge).
2. Or use any static file server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```

### Vercel Deployment:
Deploy directly as a static project:
```bash
vercel deploy --prod
```

---

## 👥 Hackathon Team Placeholder
- **Team Name:** Satyagraha Coders
- **Event:** Gandhi Hackathon, IIT Bhilai
- **Live URL:** [https://swaraj-dates.vercel.app](https://swaraj-dates.vercel.app) *(placeholder)*
