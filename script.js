const ADMIN_TOKEN_STORAGE_KEY = "portfolio-admin-token";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function initialsFromName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "YN";
}



function openMobileNav(forceOpen) {
  const topnav = document.getElementById("topnav");
  const navToggle = document.getElementById("navToggle");
  if (!topnav || !navToggle) {
    return;
  }

  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !topnav.classList.contains("is-open");
  topnav.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
}

function closeMobileNav() {
  openMobileNav(false);
}

async function trackClick(payload) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(payload)
    });
  } catch {
    // Tracking should never block the UI.
  }
}

function wireTracking() {
  document.addEventListener("click", (event) => {
    const tracked = event.target.closest("[data-track]");
    if (!tracked) {
      return;
    }

    const payload = {
      type: tracked.dataset.trackType || "click",
      label: tracked.dataset.trackLabel || tracked.textContent.trim() || tracked.id || "unknown",
      path: tracked.dataset.trackPath || window.location.pathname
    };

    trackClick(payload);
  });
}

function renderSkills(skills) {
  const skillsList = document.getElementById("skillsList");
  skillsList.innerHTML = "";

  safeArray(skills).forEach((skill) => {
    const item = document.createElement("li");
    item.textContent = skill;
    skillsList.appendChild(item);
  });
}

function renderProjects(projects) {
  const projectsGrid = document.getElementById("projectsGrid");
  projectsGrid.innerHTML = "";

  safeArray(projects).forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-item";

    const title = document.createElement("h3");
    title.textContent = project.title || "Project";

    const description = document.createElement("p");
    description.textContent = project.description || "";

    const stackWrap = document.createElement("p");
    stackWrap.className = "stack";
    const stack = safeArray(project.stack).join(" | ");
    stackWrap.textContent = stack ? `Stack: ${stack}` : "";

    const links = document.createElement("div");
    links.className = "project-links";

    if (project.liveUrl && project.liveUrl !== "#") {
      const live = document.createElement("a");
      live.href = project.liveUrl;
      live.target = "_blank";
      live.rel = "noopener noreferrer";
      live.textContent = "Live";
      live.dataset.track = "1";
      live.dataset.trackType = "project-live";
      live.dataset.trackLabel = project.title ? `${project.title} live` : "Project live";
      live.dataset.trackPath = project.liveUrl;
      links.appendChild(live);
    }

    if (project.codeUrl && project.codeUrl !== "#") {
      const code = document.createElement("a");
      code.href = project.codeUrl;
      code.target = "_blank";
      code.rel = "noopener noreferrer";
      code.textContent = "Code";
      code.dataset.track = "1";
      code.dataset.trackType = "project-code";
      code.dataset.trackLabel = project.title ? `${project.title} code` : "Project code";
      code.dataset.trackPath = project.codeUrl;
      links.appendChild(code);
    }

    card.append(title, description, stackWrap, links);
    projectsGrid.appendChild(card);
  });
}

function renderExperience(experience) {
  const experienceList = document.getElementById("experienceList");
  experienceList.innerHTML = "";

  safeArray(experience).forEach((item) => {
    const block = document.createElement("article");
    block.className = "experience-item";

    const title = document.createElement("h3");
    title.textContent = item.title || "Role";

    const duration = document.createElement("p");
    duration.innerHTML = `<strong>${item.duration || ""}</strong>`;

    const details = document.createElement("p");
    details.textContent = item.details || "";

    block.append(title, duration, details);
    experienceList.appendChild(block);
  });
}

function renderHighlights(highlights) {
  const highlightsGrid = document.getElementById("highlightsGrid");
  highlightsGrid.innerHTML = "";

  safeArray(highlights).forEach((item) => {
    const card = document.createElement("article");
    card.className = "feature-card";

    const title = document.createElement("h3");
    title.textContent = item.title || "Highlight";

    const detail = document.createElement("p");
    detail.className = "meta";
    detail.textContent = item.detail || "";

    card.append(title, detail);
    highlightsGrid.appendChild(card);
  });
}

function renderCertifications(certifications) {
  const certificationsList = document.getElementById("certificationsList");
  certificationsList.innerHTML = "";

  safeArray(certifications).forEach((item) => {
    const block = document.createElement("article");
    block.className = "timeline-item";

    const title = document.createElement("h3");
    title.textContent = item.name || "Certification";

    const issuer = document.createElement("p");
    issuer.className = "meta";
    issuer.textContent = `${item.issuer || ""}${item.year ? ` • ${item.year}` : ""}`;

    block.append(title, issuer);
    certificationsList.appendChild(block);
  });
}

function renderServices(services) {
  const servicesGrid = document.getElementById("servicesGrid");
  servicesGrid.innerHTML = "";

  safeArray(services).forEach((item) => {
    const card = document.createElement("article");
    card.className = "feature-card";

    const title = document.createElement("h3");
    title.textContent = item.title || "Service";

    const detail = document.createElement("p");
    detail.className = "meta";
    detail.textContent = item.detail || "";

    card.append(title, detail);
    servicesGrid.appendChild(card);
  });
}

function renderContactLinks(links) {
  const contactLinks = document.getElementById("contactLinks");
  contactLinks.innerHTML = "";

  if (links.email) {
    const listItem = document.createElement("li");
    const label = document.createElement("div");
    label.className = "contact-label";
    label.textContent = "Email";

    const span = document.createElement("span");
    span.className = "contact-text";
    span.textContent = links.email;

    listItem.appendChild(label);
    listItem.appendChild(span);
    contactLinks.appendChild(listItem);
  }

  if (links.phone) {
    const listItem = document.createElement("li");
    const label = document.createElement("div");
    label.className = "contact-label";
    label.textContent = "Phone";

    const span = document.createElement("span");
    span.className = "contact-text";
    span.textContent = links.phone;

    listItem.appendChild(label);
    listItem.appendChild(span);
    contactLinks.appendChild(listItem);
  }

  const socialContainer = document.createElement("li");
  socialContainer.className = "social-icons-container";

  const socialLinks = [
    {
      key: "github",
      icon: '<i class="fab fa-github"></i>',
      label: "GitHub"
    },
    {
      key: "linkedin",
      icon: '<i class="fab fa-linkedin"></i>',
      label: "LinkedIn"
    },
    {
      key: "leetcode",
      icon: '<span class="social-icon-mask leetcode-mask" aria-hidden="true"></span>',
      label: "LeetCode"
    }
  ];

  for (const entry of socialLinks) {
    const url = links[entry.key];
    if (!url || url === "#") {
      continue;
    }

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = `social-icon ${entry.key}-icon`;
    link.title = entry.label;
    link.dataset.track = "1";
    link.dataset.trackType = `social-${entry.key}`;
    link.dataset.trackLabel = entry.label;
    link.dataset.trackPath = url;
    link.innerHTML = entry.icon;
    socialContainer.appendChild(link);
  }

  if (socialContainer.children.length > 0) {
    contactLinks.appendChild(socialContainer);
  }
}

function configurePhotoAndResume(data) {
  const image = document.getElementById("profilePhoto");
  const fallback = document.getElementById("photoFallback");
  const avatarWrap = document.getElementById("avatarWrap");
  const resumeButton = document.getElementById("resumeButton");

  fallback.textContent = initialsFromName(data.name);
  fallback.style.display = "grid";
  avatarWrap.style.backgroundImage = "none";

  if (data.profilePhoto) {
    avatarWrap.style.backgroundImage = `url("${data.profilePhoto}")`;
    avatarWrap.style.backgroundSize = "cover";
    avatarWrap.style.backgroundRepeat = "no-repeat";
    avatarWrap.style.backgroundPosition = "center 14%";
    image.style.display = "none";
    fallback.style.display = "none";
    image.src = data.profilePhoto;
  } else {
    image.style.display = "none";
    fallback.style.display = "grid";
  }

  if (data.resumePdf) {
    resumeButton.href = data.resumePdf;
    resumeButton.classList.remove("disabled");
    resumeButton.dataset.track = "1";
    resumeButton.dataset.trackType = "resume-download";
    resumeButton.dataset.trackLabel = "Resume download";
    resumeButton.dataset.trackPath = data.resumePdf;
  } else {
    resumeButton.href = "#";
    resumeButton.classList.add("disabled");
    resumeButton.setAttribute("aria-disabled", "true");
    resumeButton.removeAttribute("download");
  }
}

function setHeaderLabels(data) {
  document.title = `${data.name} | Portfolio`;
  document.getElementById("brandName").textContent = data.name;
  document.getElementById("sidebarName").textContent = data.name;
  document.getElementById("sidebarRole").textContent = data.role;
  document.getElementById("heroHeadline").textContent =
    data.headline || "Building meaningful software products.";
  document.getElementById("heroSummary").textContent = data.summary;
  document.getElementById("aboutText").textContent = data.about;
  document.getElementById("footerText").textContent = `${new Date().getFullYear()} ${data.name}. Crafted with clarity.`;
}

function render(data) {
  const links = data.links || {};

  setHeaderLabels(data);
  renderSkills(data.skills);
  renderHighlights(data.highlights);
  renderCertifications(data.certifications);
  renderProjects(data.projects);
  renderExperience(data.experience);
  renderServices(data.services);
  renderContactLinks(links);
  configurePhotoAndResume(data);
}

function bindContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) {
    return;
  }

  const status = document.getElementById("formStatus");
  const submitButton = form.querySelector('button[type="submit"]');

  function setStatus(message, state) {
    status.className = "form-status";
    if (state) {
      status.classList.add(`is-${state}`);
    }
    status.textContent = message;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    setStatus("Sending message...", "pending");

    const payload = {
      name: document.getElementById("nameInput").value.trim(),
      email: document.getElementById("emailInput").value.trim(),
      message: document.getElementById("messageInput").value.trim(),
      website: document.getElementById("websiteInput").value.trim()
    };

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        setStatus(result.error || "Message could not be sent.", "error");
        return;
      }

      form.reset();
      setStatus("Thanks, your message was delivered.", "success");
    } catch {
      setStatus("Could not connect to server.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send";
    }
  });
}

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";
}

function setAdminToken(token) {
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  }
}

function setAdminStatus(message, state) {
  const status = document.getElementById("adminStatus");
  if (!status) {
    return;
  }

  status.className = "form-status";
  if (state) {
    status.classList.add(`is-${state}`);
  }
  status.textContent = message;
}

function renderAdminMessages(messages) {
  const container = document.getElementById("adminMessagesList");
  container.innerHTML = "";

  if (!messages.length) {
    const empty = document.createElement("p");
    empty.className = "meta";
    empty.textContent = "No messages yet.";
    container.appendChild(empty);
    return;
  }

  messages.forEach((message) => {
    const card = document.createElement("article");
    card.className = "admin-item";

    const head = document.createElement("div");
    head.className = "admin-item-head";

    const name = document.createElement("strong");
    name.textContent = message.name;

    const time = document.createElement("span");
    time.textContent = new Date(message.created_at).toLocaleString();

    const email = document.createElement("p");
    email.className = "meta";
    email.textContent = message.email;

    const body = document.createElement("p");
    body.textContent = message.message;

    head.append(name, time);
    card.append(head, email, body);
    container.appendChild(card);
  });
}

function renderAdminClicks(clicks) {
  const container = document.getElementById("adminClicksList");
  container.innerHTML = "";

  if (!clicks.length) {
    const empty = document.createElement("p");
    empty.className = "meta";
    empty.textContent = "No tracked clicks yet.";
    container.appendChild(empty);
    return;
  }

  clicks.forEach((item) => {
    const card = document.createElement("article");
    card.className = "admin-item";

    const head = document.createElement("div");
    head.className = "admin-item-head";

    const label = document.createElement("strong");
    label.textContent = item.label;

    const count = document.createElement("span");
    count.textContent = `${item.count} clicks`;

    const pathText = document.createElement("p");
    pathText.className = "meta";
    pathText.textContent = item.path;

    head.append(label, count);
    card.append(head, pathText);
    container.appendChild(card);
  });
}

async function loadAdminDashboard() {
  const token = getAdminToken();
  if (!token) {
    setAdminStatus("Enter the admin token to unlock the dashboard.", "pending");
    return;
  }

  const response = await fetch("/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (response.status === 401) {
    setAdminToken("");
    throw new Error("Invalid admin token.");
  }

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.error || "Unable to load dashboard.");
  }

  const data = await response.json();
  document.getElementById("adminMessageCount").textContent = String(data.messages || 0);
  document.getElementById("adminClickCount").textContent = String(data.clicks || 0);
  document.getElementById("adminEventCount").textContent = String(data.events || 0);
  renderAdminMessages(safeArray(data.recentMessages));
  renderAdminClicks(safeArray(data.topClicks));

  document.getElementById("adminUnlockedView").hidden = false;
  setAdminStatus("Dashboard unlocked.", "success");
}

function bindAdminDashboard() {
  const adminApp = document.getElementById("adminApp");
  const adminForm = document.getElementById("adminLoginForm");
  const adminTokenInput = document.getElementById("adminTokenInput");
  const logoutButton = document.getElementById("adminLogoutButton");

  if (!adminApp || !adminForm || !adminTokenInput || !logoutButton) {
    return;
  }

  adminApp.hidden = false;

  adminForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const token = adminTokenInput.value.trim();
    if (!token) {
      setAdminStatus("Please enter your dashboard token.", "error");
      return;
    }

    setAdminToken(token);
    try {
      await loadAdminDashboard();
    } catch (error) {
      setAdminStatus(error.message || "Could not unlock dashboard.", "error");
    }
  });

  logoutButton.addEventListener("click", () => {
    setAdminToken("");
    adminTokenInput.value = "";
    document.getElementById("adminUnlockedView").hidden = true;
    setAdminStatus("Dashboard locked.", "pending");
  });

  const storedToken = getAdminToken();
  if (storedToken) {
    adminTokenInput.value = storedToken;
    loadAdminDashboard().catch((error) => {
      setAdminStatus(error.message || "Could not unlock dashboard.", "error");
    });
  } else {
    setAdminStatus("Enter the admin token to unlock the dashboard.", "pending");
  }
}

function bindNavigation() {
  const navToggle = document.getElementById("navToggle");
  const topnav = document.getElementById("topnav");

  if (navToggle) {
    navToggle.addEventListener("click", () => openMobileNav());
  }

  if (topnav) {
    topnav.querySelectorAll("a").forEach((link) => {
      link.dataset.track = "1";
      link.dataset.trackType = "nav";
      link.dataset.trackLabel = link.textContent.trim();
      link.dataset.trackPath = link.getAttribute("href") || window.location.pathname;
      link.addEventListener("click", closeMobileNav);
    });
  }

  if (topnav && navToggle) {
    document.addEventListener("click", (event) => {
      const topbar = document.querySelector(".topbar");
      if (!topbar || topbar.contains(event.target)) {
        return;
      }
      closeMobileNav();
    });
  }
}

function configurePageMode() {
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  const adminApp = document.getElementById("adminApp");
  const isAdminPath = window.location.pathname.startsWith("/admin");

  if (isAdminPath) {
    // On dedicated admin page, admin content lives inside <main>, so keep it visible.
    if (main) {
      main.hidden = adminApp ? false : true;
    }
    if (footer) {
      footer.hidden = true;
    }
    if (adminApp) {
      adminApp.hidden = false;
    }
    return true;
  }

  if (adminApp) {
    adminApp.hidden = true;
  }

  return false;
}

async function init() {
  bindNavigation();
  wireTracking();
  bindContactForm();

  const isAdminMode = configurePageMode();

  if (!isAdminMode) {
    try {
      const response = await fetch("/api/portfolio");
      if (!response.ok) {
        throw new Error("Portfolio request failed");
      }
      const data = await response.json();
      render(data);
    } catch {
      document.getElementById("heroSummary").textContent =
        "Portfolio data could not be loaded. Start the server and refresh.";
    }
  }

  if (window.location.pathname.startsWith("/admin")) {
    bindAdminDashboard();
  }
}

init();
