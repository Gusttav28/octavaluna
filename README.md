# Octava Luna

Octava Luna is a bilingual ecommerce storefront for a Costa Rica jewelry brand. The site includes public shopping experiences, product and collection detail pages, currency switching between USD and CRC, and an admin panel for managing product and collection content from the browser.

## Tech Stack

- Next.js App Router
- React 19
- Tailwind CSS 4
- Radix UI primitives
- Lucide React icons
- Browser localStorage for editable product, collection, category, currency, and exchange-rate data

## Main Features

- Public storefront with home, shop, collections, about, contact, account, and admin routes.
- Product cards with photos, categories, prices, discounts, inventory status, and translated descriptions.
- Product detail screens with image gallery, quantity selector, share action, add-to-bag button, price, description, and related products.
- Collection listing with category filters and collection detail screens.
- Shop filters for availability, category, and price sorting.
- Currency toggle between USD and CRC.
- Admin-configurable CRC exchange rate for Costa Rica pricing.
- Global top notification for save/reset actions.
- Smooth scroll reveal motion for page content.
- English and Spanish UI translation support.

## Admin Panel

The admin panel is available at `/admin`.

Admins can manage:

- Shop products.
- Collections.
- Product categories.
- Collection categories.
- Product photos, up to 4 per product.
- Collection photos, up to 4 per collection.
- Product title, price, category, discount, inventory, and off-site sales.
- Product descriptions in English and Spanish.
- Collection title, category, description, number of pieces, and cover images.
- Featured collection content.
- USD to CRC exchange rate.

New product and collection categories can be created by typing a new category name in the admin forms. Those categories are saved locally and become available in filters and future admin edits.

## Translations

Translations live in `lib/translations.ts`.

The UI supports:

- English (`en`)
- Spanish (`es`)

All visible UI added to the storefront or admin panel should have matching English and Spanish keys. Product descriptions are stored separately from UI copy:

- `descriptions.en`
- `descriptions.es`

When the language switcher changes the site language, product descriptions shown in the shop, category pages, product grid, and product details switch to the matching language.

## Currency

Currency behavior is managed by `lib/site-context.tsx`.

- USD is the base currency for product prices.
- CRC prices are calculated with the admin-configured exchange rate.
- The header currency button switches all displayed product prices between USD and CRC.
- The icon changes with the selected currency: dollar sign for USD and colon symbol for CRC.

## Data Persistence

Editable ecommerce data is currently saved in browser localStorage. This keeps the project lightweight and easy to test locally, but it means admin changes are browser-specific until a backend is added.

Stored data includes:

- Products: `octavaluna_products`
- Product categories: `octavaluna_product_categories`
- Collections: `octavaluna_collections`
- Featured collection: `octavaluna_collections_featured`
- Collection categories: `octavaluna_collection_categories`
- Site settings, including currency and exchange rate: `octavaluna_site_settings`

## Important Routes

- `/` - Home page
- `/shop` - Product shop with filters
- `/shop/[category]` - Category-specific product listing
- `/product/[slug]` - Product detail page
- `/collections` - Collection listing with category filters
- `/collections/[slug]` - Collection detail page
- `/about` - Brand story
- `/contact` - Contact page
- `/account` - Account flow
- `/admin` - Admin panel

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

## Scripts

```bash
npm run dev
```

Starts the local Next.js development server.

```bash
npm run build
```

Builds the production app.

```bash
npm run start
```

Starts the production build.

```bash
npm run lint
```

Runs ESLint.

## Verification

Useful checks after changing UI or admin behavior:

```bash
npm run lint
```

```bash
curl -I http://127.0.0.1:3000/admin
curl -I http://127.0.0.1:3000/shop
curl -I http://127.0.0.1:3000/collections
curl -I http://127.0.0.1:3000/product/luna-crescent-necklace
```

Current lint note: product and collection images use regular `<img>` tags, so Next.js may warn about image optimization. Those warnings are known and do not block the current functionality.

## Development Notes

- Keep new UI labels in `lib/translations.ts` for both English and Spanish.
- Keep product descriptions editable in both languages when adding or changing product forms.
- Keep admin behavior consistent between shop products and collections.
- Avoid adding a backend assumption until persistence is intentionally moved out of localStorage.
