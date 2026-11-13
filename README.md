# Kerit S. Adalid — Personal Portfolio

A responsive, single-page portfolio made with HTML, CSS, JavaScript, and Bootstrap 5. It is a static site and does not require a build step or a server-side runtime.

## Run locally

1. Open `index.html` in a browser. For the best local development experience, use Visual Studio Code with the **Live Server** extension and choose **Open with Live Server**.
2. An internet connection is needed to load Bootstrap, Bootstrap Icons, and the optional Google Fonts from their CDNs. The rest of the site is included in this folder.

## Personalize before sharing

- The profile image is `assets/profile.jpg`. Replace it with your preferred photo (keep the same filename) or update the image `src` and `alt` text in `index.html`.
- Add your real email, Facebook profile, and phone number in the Contact section, resume preview, and resume modal in `index.html`.
- Add only certificates, seminar details, technologies, project descriptions, links, screenshots, and contributions that are accurate for you.
- Update the project detail copy in `js/script.js` and the resume text in the `cvSections` array in `js/script.js` when your details change.
- Adjust the page title and description in the `<head>` of `index.html` if you want different search or sharing text.

## Add skills, projects, and certificates

Use the **More to learn** skill card, **Add a project**, or **Add a seminar or certificate** button on the page. Saved entries can be removed with the trash button and are stored in that browser's local storage.

Because this is a static website with no admin server, entries added this way are only visible in the same browser and device. To make them visible to employers and other visitors, add the same information to the site files and redeploy, or connect the site to a backend/content-management service.

Added entries appear in the on-page resume preview. To include them in the downloadable PDF, update the `cvSections` data in `js/script.js` and redeploy.

## Resume PDF

The **Download CV** buttons generate and download `Kerit-S-Adalid-CV.pdf` in the browser. The PDF contains the supplied education, skills, projects, location, and career goal. Missing contact and credential details are shown as editable placeholders rather than invented information.

## Deploy

Upload this folder, keeping the `css`, `js`, and `assets` subfolders intact, to any static web host such as GitHub Pages, Netlify, or Cloudflare Pages. No build command is needed. Make sure `index.html` is the published site entry point.
