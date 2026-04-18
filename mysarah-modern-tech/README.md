# Mysarah Modern Tech Private Limited Website

Production-ready fullstack corporate website for a multi-sector startup based in Assam, India.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Vanilla CSS
- MongoDB Atlas + Mongoose
- Nodemailer
- JWT + secure cookies for admin auth
- Vercel deployment

## Unified Fullstack Architecture

- Frontend pages: `/`, `/sectors`, `/sectors/[slug]`, `/about`, `/contact`
- Admin: `/admin`, `/admin/login`
- Backend APIs (same domain): `/api/*`
- Example in production:
	- `mysarahtech.com`
	- `mysarahtech.com/sectors`
	- `mysarahtech.com/api/leads`
	- `mysarahtech.com/admin`

## Folder Structure

```text
src/
	app/
		about/page.tsx
		admin/
			login/page.tsx
			page.tsx
		api/
			admin/
				leads/[id]/route.ts
				leads/route.ts
				login/route.ts
				logout/route.ts
			leads/route.ts
			health/route.ts
		contact/page.tsx
		sectors/
			[slug]/page.tsx
			page.tsx
		globals.css
		layout.tsx
		page.tsx
		robots.ts
		sitemap.ts
	components/
		admin/AdminLeadsTable.tsx
		forms/LeadForm.tsx
		home/HeroCarousel.tsx
		layout/Footer.tsx
		layout/Navbar.tsx
		shared/Analytics.tsx
		shared/SectionHeading.tsx
		shared/SectorCard.tsx
		shared/WhatsAppButton.tsx
	lib/
		auth.ts
		constants.ts
		db.ts
		lead-service.ts
		mailer.ts
		sectors.ts
		validation.ts
		models/Lead.ts
	types/
		lead.ts
public/
	images/
		hero-ev.svg
		hero-grid.svg
		hero-solar.svg
```

## Features

- Corporate multi-sector structure with dynamic sector routing
- Solar sector fully active and content-rich
- Card-based sectors with coming-soon placeholders
- Lead generation forms (quote/contact/order)
- MongoDB lead storage
- Optional lead email notifications
- Protected admin dashboard with mini CRM actions:
	- View lead details
	- Update lead status
	- Delete lead
- WhatsApp floating CTA
- Google Maps embed
- SEO metadata + Open Graph + sitemap + robots
- GA4 analytics with SPA page-view tracking, web-vitals events, and lead conversion events
- Responsive mobile-first UI with animations

## Environment Variables

Copy `.env.example` into `.env.local` and set values.

Required:

- `MONGODB_URI`
- `AUTH_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_HASH`

Optional:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `ALERT_EMAIL_FROM`
- `ALERT_EMAIL_TO`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`

The solar application form uploads document images directly to Cloudinary using an unsigned upload preset. Set the two Cloudinary variables above before testing the document workflow.

To generate admin password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('your_password', 10))"
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Traffic Validation and Capacity Testing

Run built-in load tests before deployment:

```bash
npm run loadtest:browse
npm run loadtest:api
npm run loadtest:mixed
```

Custom target example:

```bash
npm run loadtest:mixed -- --url https://mysarahtech.com --concurrency 80 --duration 60
```

See full operational playbook in `TRAFFIC_LOAD_TEST_AND_CAPACITY.md`.

## API Endpoints

- `POST /api/leads` submit a lead
- `POST /api/admin/login` admin login
- `POST /api/admin/logout` admin logout
- `GET /api/admin/leads` fetch all leads
- `PATCH /api/admin/leads/:id` update status
- `DELETE /api/admin/leads/:id` delete lead
- `GET /api/health` health check

## Deployment (Vercel)

1. Push this project to GitHub.
2. Import repository in Vercel.
3. Set environment variables in Vercel Project Settings.
4. Deploy.
5. Add custom domain `mysarahtech.com` in Vercel Domains.
6. Set DNS records at your domain provider as instructed by Vercel.
7. Update `NEXT_PUBLIC_SITE_URL` to your live domain.

## Migration Path to Spring Boot Later

Current backend is modular with clear separation:

- route handlers in `src/app/api/*`
- business logic in `src/lib/lead-service.ts`
- validation in `src/lib/validation.ts`

When moving to Spring Boot, keep UI unchanged and migrate API/service/model layers to Java controllers/services/entities using the same payload contracts.
