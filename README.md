# 💼 Chakri Khujhi

**Bangladesh's modern job board platform** — connecting talented professionals with top companies.

[![Live Demo](https://img.shields.io/badge/Live-chakri--khuji.vercel.app-8b5cf6?style=for-the-badge&logo=vercel)](https://chakri-khuji.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-sahadat772-22d3ee?style=for-the-badge&logo=github)](https://github.com/sahadat772/chakri-khuji)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

---

## 🚀 Live Demo

🔗 **[https://chakri-khuji.vercel.app](https://chakri-khuji.vercel.app)**

---

## ✨ Features

### For Job Seekers 👤
- Browse and search jobs by keyword, category, or location
- One-click apply with resume upload
- Personal dashboard to track applications
- Profile with avatar upload

### For Companies 🏢
- Post and manage job listings
- Review and manage applicants
- Company profile with logo upload
- Applicant status management (Pending / Reviewed / Accepted / Rejected)

### General ✅
- Google OAuth + Email/Password authentication (NextAuth.js)
- Role-based dashboards (Candidate vs Company)
- Email notifications on application via Nodemailer
- Category-based job browsing (Technology, Design, Marketing, Finance, Sales, HR)
- Fully responsive — mobile, tablet, desktop
- Dark themed modern UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Database | MongoDB + Mongoose |
| Authentication | NextAuth.js v5 (beta) |
| File Upload | Cloudinary |
| Email | Nodemailer v7 |
| Styling | Tailwind CSS v4 |
| Deployment | Vercel |

---

## 📁 Project Structure

```
app/
├── (public)/           # Public pages
│   ├── page.js         # Homepage
│   ├── jobs/           # Job listings + detail
│   ├── companies/      # Companies page
│   ├── about/          # About page
│   └── contact/        # Contact page
├── dashboard/
│   ├── candidate/      # Job seeker dashboard
│   └── company/        # Company dashboard
│       └── post-job/   # Post new job
├── api/
│   ├── auth/           # NextAuth + register
│   ├── jobs/           # Job CRUD
│   ├── apply/          # Job applications
│   ├── applications/   # Application management
│   ├── companies/      # Company listings
│   ├── upload/         # Cloudinary upload
│   └── user/           # User profile
├── login/
├── signup/
└── components/
    └── ui/             # Navbar, Footer, etc.
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sahadat772/chakri-khuji.git
cd chakri-khuji
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

Deployed on **Vercel**. To deploy your own:

1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add all environment variables
4. Deploy!

---

## 📬 Contact

**Sahadat Hossain**
- 📧 mohammadsahadathossain381@gmail.com
- 🔗 [LinkedIn](https://www.linkedin.com/in/sahadat-hossain-350208209/)
- 🐙 [GitHub](https://github.com/sahadat772)

---

<div align="center">
  Built with ❤️ for Bangladesh 🇧🇩
</div>
