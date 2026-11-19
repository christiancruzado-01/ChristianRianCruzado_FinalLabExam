# URBAN THREADS – Clothing Apparel Store

A responsive, frontend-only clothing catalog website built with HTML5, CSS3, JavaScript and Bootstrap 5.

- **Student Name:** [Your Name]
- **Section:** [Your Section]

## Problem Being Addressed
Small local clothing brands often lack a simple, attractive online catalog where customers can browse products, compare prices and prepare an order. Urban Threads shows how a lightweight website can provide that experience without a backend.

## Target Users
- Students and young adults
- People interested in fashion and streetwear
- Customers looking for affordable, trendy clothing
- Online shoppers who want an easy way to browse apparel

## Project Objectives
1. Build a professional, multi-page, responsive clothing catalog.
2. Let users search, filter and sort products.
3. Provide a working shopping cart that persists using localStorage.
4. Provide a validated contact form with clear feedback.

## Main Features
- Responsive navbar with live cart counter on every page
- Home page: hero, featured products, categories, promo banner, footer
- Shop page: 14 products, search by name, category filter, price sorting
- Product details modal (description, sizes, add to cart)
- Shopping cart panel: add, remove, increase/decrease quantity, subtotal, shipping, total
- Cart saved in localStorage and restored after refresh; empty-cart message
- About page: brand story, mission, vision, why choose us, gallery, slogan
- Contact page: contact info, validated form (required fields + email format), success/error messages
- Accessibility: labels on all inputs, skip link, visible focus outlines, reduced-motion support
- Category links in the footer and home page open the shop pre-filtered (`shop.html?category=Hoodies`)

## Technologies Used
HTML5, CSS3, JavaScript (ES6), Bootstrap 5.3 (CDN), Bootstrap Icons (CDN), Google Fonts (Archivo Black, Space Grotesk), localStorage.

## How to Open and Use
1. Download/extract the `urban-threads` folder.
2. Open `index.html` in any modern browser (Chrome, Edge, Firefox). An internet connection is needed for Bootstrap, icons, fonts and product photos.
3. Go to **Shop** to search, filter, sort, view details and add items to the cart.
4. Click the bag icon to open the cart and change quantities.
5. Use **Contact** to send a message (the form is validated but no email is actually sent).

## AI Tools Used
- **Lovable (AI web builder):** generated the page structure, styling, JavaScript logic and documentation drafts from the project brief. See `PROMPT_LOG.md`.
- [Add any other AI tools you used and what they contributed.]

## Testing Performed and Corrections Made
[Fill in the tests you performed yourself, e.g. navigation links, search, filters, sorting, cart totals, refresh persistence, form validation, mobile/tablet/desktop views, browser console errors — and anything you fixed.]

## Known Limitations
- No real checkout, payments, user accounts or backend; the checkout button only shows a message.
- The contact form does not send emails.
- Product data is hard-coded in `assets/js/script.js`.
- Product photos load from Unsplash, so an internet connection is required.

## Image and Resource Credits
- Product and lifestyle photos: [Unsplash](https://unsplash.com) (Unsplash License)
- [Bootstrap 5](https://getbootstrap.com) and [Bootstrap Icons](https://icons.getbootstrap.com) (MIT License)
- Fonts: [Google Fonts](https://fonts.google.com) – Archivo Black, Space Grotesk (OFL)
