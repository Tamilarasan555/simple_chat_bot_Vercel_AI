# Design System

## 1. Brand Identity

### Colors
- Primary: `#2563EB` (Blue)
- Secondary: `#10B981` (Green)
- Accent: `#F59E0B` (Yellow)
- Error: `#EF4444` (Red)
- Success: `#10B981` (Green)

#### Gray Scale
- Background: `#F9FAFB`
- Surface: `#FFFFFF`
- Border: `#E5E7EB`
- Text Primary: `#111827`
- Text Secondary: `#6B7280`

### Typography

#### Font Families
- Heading: Inter
- Body: Inter
- Monospace: JetBrains Mono

#### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### Spacing
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

## 2. Components

### Buttons

#### Primary Button
```html
<button class="bg-primary text-white px-4 py-2 rounded-lg">
  Button Text
</button>

Secondary Button

<button class="border-2 border-primary text-primary px-4 py-2 rounded-lg">
  Button Text
</button>

Ghost Button
<button class="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg">
  Button Text
</button>

Input Fields

Text Input

<input   class="border border-gray-300 rounded-lg px-4 py-2   focus:ring-2 focus:ring-primary"  type="text"/>
Text Area

<textarea   class="border border-gray-300 rounded-lg px-4 py-2   focus:ring-2 focus:ring-primary"  rows="4"></textarea>

Chat Components

Message Bubble

<div class="rounded-lg p-4 max-w-[80%]">  <!-- User Message -->  <div class="bg-primary text-white ml-auto">    Message content  </div>    <!-- AI Message -->  <div class="bg-gray-100 text-gray-900">    Message content  </div></div>

Loading Indicator

<div class="flex gap-2">  <div class="animate-bounce">●</div>  <div class="animate-bounce delay-100">●</div>  <div class="animate-bounce delay-200">●</div></div>

3. Layouts
Chat Interface
plaintext

┌──────────────────────────────────┐
│ Header                           │
├──────────────────────────────────┤
│                                  │
│                                  │
│          Chat History           │
│                                  │
│                                  │
├──────────────────────────────────┤
│ Message Input                    │
└──────────────────────────────────┘
Settings Panel
plaintext
┌──────────────────────────────────┐
│ Settings Header                  │
├──────────────────────────────────┤
│ ┌────────────┐                   │
│ │            │  Setting Item     │
│ │   Icon     │  Description     │
│ │            │                   │
│ └────────────┘                   │
├──────────────────────────────────┤
│          More Settings           │
└──────────────────────────────────┘