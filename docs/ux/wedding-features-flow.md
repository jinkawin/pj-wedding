# Flow Specification & Design Principles: Wedding Features

## 1. User Flow: Seat Map (Interactive Floor Plan & Search)

### Entry Points
- Global Navigation bar (`/seating` or `/seat-map`)
- Overview page quick action link

### Screen Structure & Hierarchy
1. **Header Section**:
   - Title: "Seat Map & Table Locator"
   - Subtitle: "Find your table and seat for Parima & Jinkawin's wedding banquet"
2. **Search & Filter Bar (Sticky / Prominent)**:
   - Search input: "Search your name or table (e.g., Win, Somchai, Table 5)..."
   - Clear button (`✕`)
   - Quick filters / category tags: "VIP", "Family (Bride)", "Family (Groom)", "College Friends", "Colleagues"
3. **Interactive Floor Plan**:
   - Ballroom reference anchors: **Main Stage & Arch** at front (North), **Bridal Walkway**, **Grand Entrance** at rear (South).
   - Tables rendered as circular/banquet SVG or CSS interactive nodes with table numbers, names, and capacity dots.
   - When a guest is searched or a table is clicked:
     - Table pulses and glows in `#C4714A` (terracotta).
     - Auto-scrolls or centers on the table.
     - Opens a **Table Details Sheet / Card**: Table name, category, and list of guests seated at this table with the searched guest clearly highlighted.
4. **Table / Guest Directory Toggle (List View vs Map View)**:
   - For guests on smaller mobile screens who prefer an accessible list or when zooming isn't ideal.

---

## 2. User Flow: Wedding Agenda

### Screen Structure & Hierarchy
1. **Header**: "Wedding Agenda & Schedule"
2. **Date & Venue Banner**: Saturday, 27 February 2027 • The Grand Ballroom
3. **Timeline Tracks**:
   - Morning Traditional Ceremony (08:30 - 11:00)
   - Afternoon Break / Preparation
   - Evening Grand Banquet & Reception (17:30 - 22:00)
4. **Event Cards**:
   - Time pill (e.g., `17:30 - 18:30`)
   - Icon / badge (🥂 Welcome Cocktails & Photo Booth, 💍 Grand Entrance & Vows, 🍽️ Banquet Feast & Speeches, 🎂 Cake Cutting & Champagne Toast, 💐 Bouquet Toss, 🎶 Afterparty & Celebration)
   - Title & description
   - Location note (Ballroom Foyer vs Main Hall)
   - Attire note / tips

---

## 3. User Flow: Photo Gallery

### Screen Structure & Hierarchy
1. **Header**: "Our Gallery & Memories"
2. **Category Filter Tabs**:
   - All
   - Pre-Wedding
   - The Proposal
   - Moments & Travels
3. **Responsive Grid / Masonry**:
   - High quality images with subtle hover zoom effect
   - Caption overlay on hover/tap
4. **Lightbox Modal**:
   - Fullscreen modal overlay (`#000000`/90)
   - High-res image display with caption, date, and location
   - Prev/Next arrows + keyboard navigation (ArrowLeft, ArrowRight, Escape)
   - Touch swipe support for mobile devices
   - Close button (`✕`)

---

## 4. Design & Accessibility Checklist
- **Color Contrast**: Complies with WCAG 2.1 AA (all text `#3B2A22` or `#5C4033` on `#FAF7F1` background has > 7:1 ratio; `#C4714A` buttons with white text exceed 4.5:1).
- **Touch Targets**: All table nodes, search results, tabs, and buttons have minimum touch target of 44x44px.
- **Keyboard Navigation**: Search input supports keyboard selection; Lightbox modal handles `Escape`, `ArrowRight`, `ArrowLeft`.
- **Multilingual Support**: All menu titles and section headings integrated with `useTranslation` (en, th, cn, jp).
- **Mobile Responsive**: Fully adaptive from 360px mobile width up to 4K displays.
