"use strict";

const projectDetails = {
  academic: {
    title: "Academic Management System with Parent Notification",
    description: "An academic management system with parent notification. Replace this description with the system's purpose, the features you implemented, the technologies used, and your specific contribution."
  },
  "car-store": {
    title: "Car Store Management System",
    description: "A car store management system. Add a short explanation of its users, the problem it addresses, its key features, and the technologies you used."
  },
  portfolio: {
    title: "Personal Portfolio Website",
    description: "A responsive personal portfolio website to introduce Kerit S. Adalid, present IT skills and project highlights, and provide an editable resume and contact section."
  }
};

const cvSections = [
  { heading: "PROFESSIONAL OBJECTIVE", lines: ["To become a skilled IT professional and gain experience in the", "technology industry. Seeking opportunities to learn, contribute,", "and grow through OJT or internship experience."] },
  { heading: "EDUCATION", lines: ["Bachelor of Science in Information Technology", "Misamis Oriental Institute of Science and Technology (MOIST)", "Expected graduation: 2027"] },
  { heading: "TECHNICAL SKILLS", lines: ["HTML  |  CSS  |  JavaScript  |  PHP  |  MySQL  |  Bootstrap", "Basic computer troubleshooting"] },
  { heading: "PROJECTS", lines: ["Academic Management System with Parent Notification", "Car Store Management System", "Personal Portfolio Website"] },
  { heading: "CONTACT", lines: ["Email: [Add your email address]", "Facebook: [Add your Facebook profile]", "Phone: [Add your phone number]", "Salay, Misamis Oriental, Philippines"] }
];

const entryStorageKeys = {
  skills: "keritPortfolio.skills.v1",
  projects: "keritPortfolio.projects.v1",
  certificates: "keritPortfolio.certificates.v1"
};

const savedEntries = {
  skills: [],
  projects: [],
  certificates: []
};

function showManagementMessage(message, isError) {
  const toastElement = document.getElementById("manageToast");
  const messageElement = document.getElementById("manageToastMessage");
  messageElement.textContent = message;
  toastElement.classList.toggle("manage-toast-error", Boolean(isError));

  if (window.bootstrap && window.bootstrap.Toast) {
    window.bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 4000 }).show();
  } else {
    window.alert(message);
  }
}

function readStoredEntries(type) {
  try {
    const storedValue = window.localStorage.getItem(entryStorageKeys[type]);
    if (storedValue === null) return [];

    const entries = JSON.parse(storedValue);
    if (!Array.isArray(entries)) {
      throw new Error("Saved entries are not in the expected format.");
    }

    const validEntries = entries.filter((entry) => {
      if (!entry || typeof entry !== "object" || typeof entry.id !== "string" || typeof entry.name !== "string") {
        return false;
      }
      if (type === "skills") return typeof entry.description === "string";
      if (type === "projects") return typeof entry.description === "string" && typeof entry.category === "string" && Array.isArray(entry.technologies);
      return typeof entry.kind === "string";
    });

    if (validEntries.length !== entries.length) {
      showManagementMessage(`Some saved ${type} were skipped because their data was incomplete.`, true);
    }
    return validEntries;
  } catch (error) {
    console.error(`Unable to load saved ${type}.`, error);
    showManagementMessage(`Unable to load saved ${type}. Check this browser's storage settings.`, true);
    return [];
  }
}

function persistEntries(type, entries) {
  try {
    window.localStorage.setItem(entryStorageKeys[type], JSON.stringify(entries));
    savedEntries[type] = entries;
    renderSavedEntries();
    showManagementMessage(`${type[0].toUpperCase()}${type.slice(1)} saved in this browser.`, false);
    return true;
  } catch (error) {
    console.error(`Unable to save ${type}.`, error);
    showManagementMessage(`Unable to save ${type}. Check this browser's storage settings and try again.`, true);
    return false;
  }
}

function makeElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function makeIcon(className, label) {
  const icon = document.createElement("i");
  icon.className = className;
  icon.setAttribute("aria-hidden", "true");
  if (label) icon.setAttribute("aria-label", label);
  return icon;
}

function makeRemoveButton(type, entry) {
  const button = makeElement("button", "entry-remove");
  button.type = "button";
  button.setAttribute("aria-label", `Remove ${entry.name}`);
  button.title = "Remove this entry";
  button.appendChild(makeIcon("bi bi-trash3"));
  button.addEventListener("click", () => {
    if (!window.confirm(`Remove "${entry.name}" from your ${type}?`)) return;
    persistEntries(type, savedEntries[type].filter((savedEntry) => savedEntry.id !== entry.id));
  });
  return button;
}

function makeEntryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function renderSavedEntries() {
  renderSkills();
  renderProjects();
  renderCertificates();
  renderResumeAdditions();
}

function renderSkills() {
  const grid = document.querySelector(".skills-grid");
  const addCard = document.getElementById("addSkillCard");
  grid.querySelectorAll("[data-user-skill]").forEach((card) => card.remove());

  savedEntries.skills.forEach((entry) => {
    const column = makeElement("div", "col-6 col-md-4 col-lg-3");
    column.dataset.userSkill = entry.id;
    const card = makeElement("article", "skill-card custom-skill-card");
    card.appendChild(makeRemoveButton("skills", entry));
    const icon = makeElement("span", "skill-icon custom-skill-icon");
    icon.appendChild(makeIcon("bi bi-stars"));
    card.appendChild(icon);
    card.appendChild(makeElement("strong", "", entry.name));
    if (entry.description) card.appendChild(makeElement("small", "", entry.description));
    column.appendChild(card);
    grid.insertBefore(column, addCard);
  });
}

function openProjectDetails(title, description) {
  document.getElementById("projectModalTitle").textContent = title;
  document.getElementById("projectModalDescription").textContent = description;
  window.bootstrap.Modal.getOrCreateInstance(document.getElementById("projectModal")).show();
}

function renderProjects() {
  const projectList = document.getElementById("projectList");
  projectList.querySelectorAll("[data-user-project]").forEach((column) => column.remove());

  savedEntries.projects.forEach((entry, index) => {
    const column = makeElement("div", "col-md-6 col-lg-4");
    column.dataset.userProject = entry.id;
    const card = makeElement("article", "project-card custom-project-card");
    const art = makeElement("div", "project-art art-custom");
    art.appendChild(makeElement("span", "project-number", `${String(index + 4).padStart(2, "0")} / PROJECT`));
    const artIcon = makeElement("span", "custom-project-icon");
    artIcon.appendChild(makeIcon("bi bi-window-stack"));
    art.appendChild(artIcon);
    art.appendChild(makeRemoveButton("projects", entry));

    const body = makeElement("div", "project-body");
    const type = makeElement("span", "project-type");
    type.appendChild(makeIcon("bi bi-folder2-open"));
    type.appendChild(document.createTextNode(` ${entry.category}`));
    body.appendChild(type);
    body.appendChild(makeElement("h3", "", entry.name));
    body.appendChild(makeElement("p", "", entry.description));

    if (entry.technologies.length > 0) {
      const tags = makeElement("div", "project-tags");
      entry.technologies.forEach((technology) => tags.appendChild(makeElement("span", "", technology)));
      body.appendChild(tags);
    }

    const detailsButton = makeElement("button", "project-link");
    detailsButton.type = "button";
    detailsButton.appendChild(document.createTextNode("Project details "));
    detailsButton.appendChild(makeIcon("bi bi-arrow-up-right"));
    detailsButton.addEventListener("click", () => openProjectDetails(entry.name, entry.description));
    body.appendChild(detailsButton);
    card.append(art, body);
    column.appendChild(card);
    projectList.appendChild(column);
  });

  document.getElementById("projectCount").textContent = String(projectList.querySelectorAll(".project-card").length).padStart(2, "0");
}

function renderCertificates() {
  const certificateList = document.getElementById("certificateList");
  certificateList.replaceChildren();

  savedEntries.certificates.forEach((entry) => {
    const column = makeElement("div", "col-md-6 col-lg-4");
    const card = makeElement("article", "certificate-card");
    const header = makeElement("div", "certificate-card-header");
    const badge = makeElement("span", "certificate-type");
    badge.appendChild(makeIcon("bi bi-patch-check"));
    badge.appendChild(document.createTextNode(` ${entry.kind}`));
    header.append(badge, makeRemoveButton("certificates", entry));
    card.append(header);
    card.appendChild(makeElement("h3", "", entry.name));

    const details = [entry.organization, entry.date].filter(Boolean).join(" · ");
    if (details) card.appendChild(makeElement("p", "certificate-meta", details));
    if (entry.description) card.appendChild(makeElement("p", "certificate-description", entry.description));
    column.appendChild(card);
    certificateList.appendChild(column);
  });
}

function renderResumeAdditions() {
  const skillList = document.getElementById("resumeCustomSkills");
  const projectList = document.getElementById("resumeCustomProjects");
  const certificateSection = document.getElementById("resumeCertificates");
  const certificateList = document.getElementById("resumeCertificateList");

  skillList.replaceChildren();
  savedEntries.skills.forEach((entry) => skillList.appendChild(makeElement("li", "", entry.name)));
  skillList.classList.toggle("d-none", savedEntries.skills.length === 0);

  projectList.replaceChildren();
  savedEntries.projects.forEach((entry) => projectList.appendChild(makeElement("li", "", entry.name)));
  projectList.classList.toggle("d-none", savedEntries.projects.length === 0);

  certificateList.replaceChildren();
  savedEntries.certificates.forEach((entry) => {
    const details = [entry.organization, entry.date].filter(Boolean).join(" - ");
    certificateList.appendChild(makeElement("li", "", details ? `${entry.name} (${details})` : entry.name));
  });
  certificateSection.classList.toggle("d-none", savedEntries.certificates.length === 0);
}

function formText(formData, name) {
  return String(formData.get(name) || "").trim();
}

function requireTrimmedValue(form, fieldName, message) {
  const field = form.elements.namedItem(fieldName);
  if (field.value.trim()) {
    field.setCustomValidity("");
    return true;
  }
  field.setCustomValidity(message);
  field.reportValidity();
  return false;
}

function closeEditor(form, modalId) {
  form.reset();
  window.bootstrap.Modal.getOrCreateInstance(document.getElementById(modalId)).hide();
}

["skillForm", "projectForm", "certificateForm"].forEach((formId) => {
  document.getElementById(formId).addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      event.target.setCustomValidity("");
    }
  });
});

function escapePdfText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildCvPdf() {
  const operations = [];
  const text = (value, x, y, size, color, font) => {
    operations.push(`${color} rg BT /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapePdfText(value)}) Tj ET`);
  };
  const line = (x1, y1, x2, y2, color, width) => {
    operations.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
  };

  operations.push("0.965 0.975 1 rg 0 0 595 842 re f");
  operations.push("1 1 1 rg 42 38 511 766 re f");
  operations.push("0.157 0.392 0.91 rg 42 738 511 66 re f");
  text("KERIT S. ADALID", 65, 774, 21, "1 1 1", "F2");
  text("IT STUDENT  |  ASPIRING IT PROFESSIONAL", 66, 754, 9, "0.88 0.93 1", "F1");
  text("Do your best and help others.", 66, 724, 9, "0.35 0.43 0.57", "F1");

  let y = 691;
  for (const section of cvSections) {
    text(section.heading, 65, y, 9, "0.157 0.392 0.91", "F2");
    line(65, y - 7, 530, y - 7, "0.87 0.9 0.94", 0.6);
    y -= 24;
    for (const content of section.lines) {
      text(content, 65, y, 9, "0.16 0.21 0.29", "F1");
      y -= 15;
    }
    y -= 12;
  }

  const stream = operations.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${new TextEncoder().encode(stream).length} >>\nstream\n${stream}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index += 1) {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

function downloadCv() {
  const blobUrl = URL.createObjectURL(buildCvPdf());
  const downloadLink = document.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = "Kerit-S-Adalid-CV.pdf";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  const toastElement = document.getElementById("downloadToast");
  if (toastElement && window.bootstrap) {
    window.bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3200 }).show();
  }
}

document.querySelectorAll("[data-download-cv]").forEach((button) => {
  button.addEventListener("click", downloadCv);
});

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projectDetails[button.dataset.project];
    if (!project) return;
    openProjectDetails(project.title, project.description);
  });
});

document.getElementById("skillForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!requireTrimmedValue(form, "name", "Enter a skill name.")) return;
  const formData = new FormData(form);
  const entry = {
    id: makeEntryId(),
    name: formText(formData, "name"),
    description: formText(formData, "description")
  };
  if (persistEntries("skills", [...savedEntries.skills, entry])) closeEditor(form, "skillModal");
});

document.getElementById("projectForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!requireTrimmedValue(form, "name", "Enter a project name.")) return;
  if (!requireTrimmedValue(form, "description", "Enter a short project summary.")) return;
  const formData = new FormData(form);
  const technologies = formText(formData, "technologies")
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean)
    .slice(0, 10);
  const entry = {
    id: makeEntryId(),
    name: formText(formData, "name"),
    category: formText(formData, "category"),
    description: formText(formData, "description"),
    technologies
  };
  if (persistEntries("projects", [...savedEntries.projects, entry])) closeEditor(form, "projectFormModal");
});

document.getElementById("certificateForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!requireTrimmedValue(form, "name", "Enter the official seminar or certificate name.")) return;
  const formData = new FormData(form);
  const entry = {
    id: makeEntryId(),
    name: formText(formData, "name"),
    kind: formText(formData, "kind"),
    organization: formText(formData, "organization"),
    date: formText(formData, "date"),
    description: formText(formData, "description")
  };
  if (persistEntries("certificates", [...savedEntries.certificates, entry])) closeEditor(form, "certificateModal");
});

Object.keys(entryStorageKeys).forEach((type) => {
  savedEntries[type] = readStoredEntries(type);
});
renderSavedEntries();

const navbar = document.querySelector(".site-navbar");
const progressBar = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");

function updateScrollUi() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
  navbar.classList.toggle("scrolled", window.scrollY > 12);
  backToTop.classList.toggle("visible", window.scrollY > 500);
}

window.addEventListener("scroll", updateScrollUi, { passive: true });
updateScrollUi();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll("#navbarContent .nav-link, #navbarContent .btn-nav").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("navbarContent");
    if (menu.classList.contains("show")) {
      window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
    }
  });
});

const yearElement = document.getElementById("currentYear");
yearElement.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

if (window.bootstrap && window.bootstrap.ScrollSpy) {
  window.bootstrap.ScrollSpy.getOrCreateInstance(document.body).refresh();
}
