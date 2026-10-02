# Garba Pass Pro

# Build Prompt — Production-Style Frontend Skeleton

Build a **frontend-only UI/UX prototype** for a professional **Sanjivani University Mega Garba Event Ticket Booking & Management System**.

The purpose of this build is to create a complete, polished, deployable frontend prototype that can be hosted directly on **Vercel**.

## CRITICAL SCOPE RULE

This is **ONLY a frontend/UI/UX prototype**.

DO NOT build:

- Backend
- Database
- API
- Server-side authentication
- Real payment gateway
- Real QR validation
- Real file upload backend
- Real email/SMS service
- External authentication
- Cloud storage
- Microservices
- Any unnecessary feature not explicitly mentioned below

However, **all frontend interactions must work**.

Use frontend state and/or localStorage/mock data where necessary so that the complete user journey can be demonstrated without a backend.

The application should behave like a real product from the user's perspective, even though all data is simulated locally.

---

# 1. DESIGN DIRECTION

Use this exact design philosophy:

**Modern Minimalistic UI + Modular Design System + Card-Based Layout + Subtle Glassmorphism**

The website should look like a combination of:

- A professional university website
- A premium modern event platform
- A clean ticket-booking application

Do NOT make it look like:

- A generic AI-generated website
- A gaming website
- An overly colorful festival website
- A complicated dashboard
- An over-decorated college portal

The design should feel:

- Premium
- Professional
- Modern
- Trustworthy
- Minimal
- Elegant
- Responsive
- Easy to navigate

Use subtle Garba/event visual identity without overwhelming the interface.

---

# 2. VISUAL SYSTEM

Use:

- Light overall interface
- White / off-white backgrounds
- Dark navy / charcoal typography
- Warm orange/saffron accent color
- Very subtle gradients
- Subtle glassmorphism
- Rounded cards
- Soft borders
- Very light shadows
- Large clean typography
- Strong spacing system
- Consistent button styles
- Consistent input styles
- Modular reusable components

Avoid excessive:

- Gradients
- Neon colors
- Heavy shadows
- Glass effects everywhere
- Animations
- Decorative elements
- Floating objects
- 3D effects

Use animations only where they improve usability.

---

# 3. RESPONSIVENESS

The entire frontend must be fully responsive.

Support:

- Desktop
- Laptop
- Tablet
- Mobile

The student ticket and QR code must be particularly well optimized for mobile screens because students will primarily show the ticket from their phones.

The gate scanner interface must also be mobile-first.

---

# 4. TECHNOLOGY

Use a modern frontend stack suitable for Vercel deployment.

Preferred:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Component-based architecture
- Lucide icons or another clean icon library

Do not introduce unnecessary dependencies.

Use reusable components.

Create a clean project structure.

---

# 5. APPLICATION STRUCTURE

The frontend should contain these primary areas:

## Student/Public

1. Public Event Landing Page
2. Registration
3. Login
4. Student Profile
5. Event Registration
6. Payment Simulation
7. My Ticket
8. Ticket/PDF-style View

## Gate

9. Gate Scanner

## Admin

10. Admin Dashboard

These are the only major areas required.

---

# 6. PUBLIC EVENT LANDING PAGE

The event page must be publicly accessible without login.

Create a professional hero section containing:

- Sanjivani University branding
- Event name
- Event banner/visual
- Event date
- Event time
- Event venue
- Ticket price
- Register Now button

Example content:

**SANJIVANI GARBA NIGHT**

**Dance • Culture • Togetherness**

**18 October 2026**

**6:00 PM onwards**

**Sanjivani University — Main Ground**

Ticket Price:

**₹299**

Primary CTA:

**Register Now**

The event page should also contain only the necessary event information:

- Event details
- Date
- Time
- Venue
- Ticket information
- Basic entry information

Do not add unnecessary sections.

The navigation should be minimal.

Example:

```text
Sanjivani University Logo

Home
Event
Login

[ Register Now ]
```

---

# 7. REGISTRATION PAGE

When the user clicks **Register Now**, navigate to the registration page.

Create a clean registration form containing:

- Full Name
- Student ID
- Institute Email
- Mobile Number
- Password
- Confirm Password

Add:

**I agree to the Terms & Conditions**

Primary button:

**Create Account**

Also provide:

**Already have an account? Login**

The form should have frontend validation.

Examples:

- Required fields
- Valid email format
- Password confirmation
- Mobile number validation

No backend authentication is required.

After successful frontend registration, store the mock user information locally and navigate to the appropriate next step.

---

# 8. LOGIN PAGE

Create a clean login page containing:

- Institute Email / Student ID
- Password

Button:

**Login**

Also provide:

**Don't have an account? Register**

Since there is no backend, use mock/local frontend authentication.

The login must actually work within the prototype.

After login, navigate to the student's dashboard/profile flow.

---

# 9. STUDENT PROFILE

Create a profile completion page.

Required information:

### Personal Details

- Full Name
- Student ID
- Email
- Mobile Number

### Verification Documents

- Latest Photo
- Institute ID Card Photo

The Latest Photo should be clearly described as:

**Latest Photo for Entry Verification**

The ID card should be clearly described as:

**Institute ID Card**

Because there is no backend, image selection can be simulated using frontend state/local preview.

After both images/details are available, allow the user to continue.

Button:

**Continue**

Do not add unnecessary profile fields.

---

# 10. EVENT REGISTRATION / TICKET PURCHASE

After profile completion, show the event registration page.

Display:

**Sanjivani Garba Night**

Event information:

- Date
- Time
- Venue

Ticket:

**General Entry**

Price:

**₹299**

Show a clear summary.

Primary button:

**Proceed to Payment**

Do not add multiple ticket types unless specifically required.

---

# 11. PAYMENT PAGE

This is ONLY a frontend payment simulation.

Do NOT integrate a real payment gateway.

Create a professional payment UI that visually represents the actual payment process.

Show:

```text
Sanjivani Garba Night

Ticket                  ₹299
Total                   ₹299
```

Payment methods can visually include:

- UPI
- Debit/Credit Card
- Net Banking

The user selects a payment method.

Primary button:

**Pay ₹299**

When clicked:

- Show a short simulated processing state
- Then show payment success
- Create the frontend mock ticket
- Navigate to the ticket page

The simulated payment state must be clearly handled through frontend state/localStorage.

---

# 12. PAYMENT SUCCESS

After simulated successful payment, show a clean success state:

**Payment Successful**

**Your ticket has been generated successfully.**

Buttons:

**View Ticket**

**Download PDF**

Since there is no backend, "Download PDF" may generate a frontend-compatible ticket document or provide a print/download experience. Do not implement a server-side PDF system.

---

# 13. MY TICKET

Create a dedicated **My Ticket** page.

Display a professional digital event ticket.

Ticket must contain:

### Event

**SANJIVANI GARBA NIGHT**

### Student

- Student Photo
- Full Name
- Student ID

### Event Details

- Date
- Time
- Venue

### Ticket

- Ticket ID
- Status

Status initially:

**ACTIVE**

### QR Code

Display a real scannable QR code generated entirely on the frontend.

The QR should contain only a mock/non-sensitive ticket token.

Example:

```text
GARB26-8AF72A91
```

Do NOT encode:

- Password
- Phone number
- Full personal information
- ID card image
- Payment information

The QR should be visually large enough to scan from a mobile screen.

---

# 14. TICKET DESIGN

The ticket itself should look like a premium professional event pass.

Suggested layout:

```text
┌───────────────────────────────────────┐
│ SANJIVANI UNIVERSITY                 │
│                                       │
│ SANJIVANI GARBA NIGHT                │
│                                       │
│ ┌─────────────┐       ┌────────────┐ │
│ │             │       │            │ │
│ │ STUDENT     │       │   QR CODE  │ │
│ │ PHOTO       │       │            │ │
│ │             │       │            │ │
│ └─────────────┘       └────────────┘ │
│                                       │
│ JAY BANKAR                            │
│ Student ID: XXXXX                     │
│                                       │
│ 18 October 2026                       │
│ 6:00 PM onwards                       │
│ Sanjivani University                  │
│                                       │
│ Ticket ID: GARB26-XXXXXXXX            │
│ Status: ACTIVE                        │
│                                       │
│ ───────────────────────────────────── │
│                                       │
│ Institute ID Card / Verification      │
│                                       │
│ [ ID CARD IMAGE ]                     │
│                                       │
└───────────────────────────────────────┘
```

The ticket must remain visually clean.

Do not overcrowd the ticket.

---

# 15. ID CARD + PHOTO

The ticket should visually include:

1. Latest student photo
2. Institute ID card image

These are for gate-side visual verification.

The ID card should not dominate the ticket.

Use a clean verification section.

---

# 16. GATE SCANNER

Create a separate `/gate` interface.

This should be visually different from the normal student interface.

Use a dark, professional scanner interface optimized for mobile/tablet.

Example:

```text
GATE 01
● ONLINE

[ QR SCANNER AREA ]

Scan Student Ticket

[ Camera ]
[ Manual Entry ]
```

The QR scanner should work using the browser camera if possible.

Since there is no backend, the scanner should validate against the frontend mock ticket stored in localStorage/state.

---

# 17. QR CHECK-IN LOGIC

The frontend prototype must simulate the actual intended behavior.

Initial state:

```text
Ticket Status = ACTIVE
```

When the correct QR is scanned:

```text
ACTIVE
   ↓
CHECKED IN
```

Show:

**ENTRY ALLOWED**

Then show:

- Student photo
- Student name
- Student ID
- Ticket ID
- Event
- Gate
- Check-in time

And:

**CHECK-IN SUCCESSFUL**

The status must also update in the student's ticket view.

---

# 18. PREVENT SECOND USE

This is mandatory.

Once a ticket has been checked in:

```text
Ticket Status = CHECKED_IN
```

If the same QR is scanned again:

Show:

**ENTRY DENIED**

**TICKET ALREADY USED**

Also display:

- Previous check-in time
- Gate

The same QR must not successfully check in again during the frontend session.

Do NOT delete the QR visually.

Simply make its ticket status:

**CHECKED IN / USED**

---

# 19. ADMIN DASHBOARD

Create a frontend-only admin dashboard.

The admin dashboard should display:

### Ticket Statistics

- Total Tickets
- Paid Tickets
- Checked-In Tickets
- Remaining Tickets

Use clean statistic cards.

Example:

```text
TOTAL TICKETS
10,000

PAID
9,842

CHECKED IN
7,421
```

### Gate Status

Display:

```text
Gate 01    ● Online
Gate 02    ● Online
Gate 03    ● Online
Gate 04    ● Online
```

### Recent Check-ins

Show a simple table:

```text
Student
Student ID
Ticket ID
Gate
Time
Status
```

The dashboard should update when a mock ticket is checked in from the gate interface.

Use localStorage/shared frontend state so the interaction can be demonstrated.

Do not build real admin authentication or backend authorization.

---

# 20. FRONTEND DATA FLOW

Because there is no backend, use localStorage/mock state.

The following should persist across page refreshes:

- Registered user
- Login state
- Student information
- Student photo
- ID card photo
- Event registration
- Payment status
- Ticket ID
- QR token
- Ticket status
- Check-in status
- Check-in time
- Gate
- Admin statistics

The prototype should feel like the data is actually connected.

---

# 21. PAGE NAVIGATION

All major actions must work.

Required flow:

```text
Landing Page
      ↓
Register
      ↓
Login / Account
      ↓
Profile
      ↓
Event Registration
      ↓
Payment
      ↓
Payment Success
      ↓
My Ticket
      ↓
Gate Scanner
      ↓
QR Verification
      ↓
Check-In
      ↓
Ticket Status Updated
      ↓
Admin Dashboard Updated
```

A user should never encounter a dead button.

Every button must either:

- Navigate
- Submit
- Open a modal
- Change state
- Show validation
- Perform the intended frontend action

---

# 22. RESPONSIVE TICKET

On mobile:

- Student photo and QR should remain clearly visible
- QR must be large enough to scan
- Important ticket information must remain readable
- Avoid horizontal scrolling

On desktop:

- Use a centered ticket card
- Maintain realistic ticket proportions

---

# 23. COMPONENT SYSTEM

Create reusable components such as:

```text
Navbar
EventHero
EventDetails
Button
Input
Card
Modal
StatusBadge
PhotoUpload
TicketCard
QRCode
PaymentCard
StatCard
GateScanner
CheckInResult
AdminTable
```

Do not duplicate UI code unnecessarily.

---

# 24. STATES TO IMPLEMENT

Every important interaction should have proper frontend states:

### Buttons

- Default
- Hover
- Active
- Disabled
- Loading

### Payment

- Ready
- Processing
- Success

### Ticket

- Active
- Checked In

### QR Scanner

- Ready
- Scanning
- Valid
- Invalid
- Already Used

### Forms

- Empty
- Focused
- Invalid
- Valid
- Submitted

---

# 25. ERROR HANDLING

Implement frontend-only error messages for:

- Empty required fields
- Invalid email
- Invalid phone number
- Password mismatch
- Missing latest photo
- Missing ID card
- Payment failure simulation if necessary
- Invalid QR
- Already-used QR

Keep error messages concise and professional.

---

# 26. ACCESSIBILITY

Use:

- Proper labels
- Keyboard-accessible buttons
- Good contrast
- Semantic HTML
- Accessible form fields
- Visible focus states
- Alt text for images

---

# 27. PERFORMANCE

Since this will eventually be associated with an event involving approximately **10,000 students**, keep the frontend lightweight.

Do not add:

- Heavy animation libraries
- Unnecessary 3D libraries
- Large background videos
- Huge assets
- Unnecessary dependencies

Optimize images.

Use lazy loading where appropriate.

Keep the landing page fast.

---

# 28. IMPORTANT: DO NOT ADD EXTRA FEATURES

Do NOT add:

- Social media feed
- Chat
- Notifications center
- Wishlist
- Reviews
- Food ordering
- Merchandise
- Coupons
- Referral system
- Loyalty system
- AI chatbot
- Event recommendations
- Maps integration
- Blog
- News section
- Complex analytics
- Multi-event marketplace
- Unrequested profile fields
- Unrequested ticket categories
- Unrequested payment features

Only implement the functionality specified in this prompt.

---

# 29. CONTENT

Use realistic placeholder event content for:

**Sanjivani University**

**Sanjivani Garba Night**

**18 October 2026**

**6:00 PM onwards**

**Sanjivani University Main Ground**

**₹299**

Use placeholder images for:

- Event banner
- Student profile
- ID card

Do not depend on an external image API.

If image assets are unavailable, create clean local placeholders.

---

# 30. FINAL QUALITY REQUIREMENT

The result should NOT look like a rough wireframe.

It should look like a **finished professional frontend prototype** that could realistically become the production website after connecting a backend.

The UI should be:

**Minimal + Premium + Professional + University/Event appropriate**

The complete prototype must be deployable to **Vercel**.

Most importantly:

### The following must actually work in the frontend:

1. Register
2. Login
3. Profile completion
4. Photo selection/preview
5. ID card selection/preview
6. Event registration
7. Payment simulation
8. Ticket generation
9. QR generation
10. View ticket
11. Ticket persistence using localStorage
12. Gate scanner interface
13. QR verification
14. Successful check-in
15. Prevention of second check-in
16. Student ticket status update
17. Admin dashboard statistics update
18. Gate/check-in information update

No backend is required.

No database is required.

No real payment processing is required.

No real production authentication is required.

Build the **complete frontend experience only**, with clean mock/local data and realistic interactions.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8bb8e8f2-e2b1-45ea-8d22-436a0cb52645).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
