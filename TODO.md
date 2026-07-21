# Digis Restaurant — Brand Identity & Content Transformation

## Overview
Transform the generic "Dave's Restaurant" landing page into **Digis Restaurant** — a premium Ethiopian feast experience. The word **Digis** (ዲጊስ) means **"Feast"** in Amharic.

---

## Progress Tracker

### ⬜ Step 1: Global CSS — Ethiopian-Inspired Color Palette
- [x] framer-motion installed for animations
- [x] Replace primary blue (#3b82f6) with deep Ethiopian red (#C62828)
- [x] Add warm earth tones, rich browns, gold accents
- [x] Warm cream/ivory background (#FFFAF0)
- [x] Define custom animation keyframes in globals.css
- [x] Add smooth scroll behavior

### ⬜ Step 2: Layout Metadata Update
- [x] Title: "Digis Restaurant — An Ethiopian Feast"
- [x] Description: Ethiopian hospitality and feast culture
- [x] Add custom font imports if needed

### ⬜ Step 3: Create Reusable Animation Components
- [x] Create `frontend/src/components/customer/animations.tsx` — fadeIn, slideUp, stagger, scroll-triggered animations using framer-motion
- [x] Create reusable `AnimatedSection`, `StaggerContainer`, `TextReveal` components

### ⬜ Step 4: Header Component — Full Rewrite
- [x] Logo: "Digis" with "ፊስታ (Feast)" tagline, placeholder for official logo
- [x] Nav: Welcome | Our Feast | Our Menu | Reserve Your Feast | Visit Us
- [x] CTAs: "Explore Our Feast" | "Gather With Us"
- [x] Premium sticky header with backdrop blur

### ⬜ Step 5: HeroSection — Full Rewrite
- [x] Brand badge: "Welcome to Digis — An Ethiopian Feast"
- [x] Hero text: Ethiopian hospitality, gathering around the table
- [x] CTAs: "Explore Our Feast" | "Reserve Your Feast"
- [x] Stats: Years of tradition | Traditional dishes | Happy guests
- [x] Elegant background with subtle Ethiopian pattern influence
- [x] Scroll-triggered animations, staggered text reveals

### ⬜ Step 6: HomePage (page.tsx) — Complete Restructure
New section flow with animations:
- [x] **Hero** (reuse HeroSection)
- [x] **Our Feast (Digis)** — The meaning of Digis, Ethiopian feast spirit, warm hospitality
- [x] **Traditional Ethiopian Flavors** — Berbere, Mitmita, Niter Kibbeh, local ingredients
- [x] **Our Kitchen** — Tradition meets modern presentation, fresh injera preparation
- [x] **Signature Dishes** — Doro Wat, Kitfo, Tibs, Misir Wot with cultural significance descriptions
- [x] **Coffee Ceremony** — The iconic Ethiopian coffee ritual section
- [x] **Guest Experiences** — Testimonials with subtle carousel
- [x] **Reserve Your Feast** — Premium CTA section
- [x] **Visit Digis** — Contact/location with elegant card layout

### ⬜ Step 7: Footer — Full Rewrite
- [x] Brand description about Ethiopian feast culture
- [x] Ethiopian coffee ceremony reference
- [x] Hours, contact updated for Digis
- [x] Elegant divider with gold accent

### ⬜ Step 8: Menu Page (menu-customer) — Header Update
- [x] Title: "Our Feast — Traditional Ethiopian Cuisine"
- [x] Description: Celebrate Ethiopian flavors and tradition
- [x] Updated color scheme to match new palette

### ⬜ Step 9: Verification & Polish
- [x] Build verification (TypeScript compilation, no errors)
- [x] Responsive design check
- [x] Animation smoothness check
- [x] Brand voice consistency across all pages

---

## Design System Reference
- **Primary**: #C62828 (Deep Ethiopian Red)
- **Primary Dark**: #8B1A1A
- **Secondary/Warm**: #D4A574 (Gold/Amber)
- **Background**: #FFFAF0 (Warm Cream)
- **Coffee Brown**: #3E2723
- **Text**: #1A0A00 (Dark Charcoal)
- **Muted**: #8D6E63 (Warm Taupe)
- **Gold Accent**: #C9A96E
- **Border/Subtle**: #E8DCC8
- **Success/Accent Green**: #2E7D32 (for fresh/herb accents)
