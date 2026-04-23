const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const resumePath = path.join(__dirname, "..", "Portfolio.pdf");
const outTextPath = path.join(__dirname, "..", "data", "resume-extracted.txt");
const outJsonPath = path.join(__dirname, "..", "data", "resume-structured.json");

function uniq(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function findSection(text, headingCandidates) {
  const lines = text.split(/\r?\n/);
  const headings = new Set(
    headingCandidates.map((h) => h.trim().toLowerCase())
  );

  let start = -1;
  for (let i = 0; i < lines.length; i += 1) {
    const normalized = lines[i].trim().toLowerCase();
    if (headings.has(normalized)) {
      start = i + 1;
      break;
    }
  }

  if (start === -1) {
    return [];
  }

  const section = [];
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) {
      section.push("");
      continue;
    }

    const maybeHeading =
      line === line.toUpperCase() && line.replace(/[^A-Za-z]/g, "").length > 3;
    if (maybeHeading) {
      break;
    }

    section.push(line);
  }

  return section;
}

(async () => {
  try {
    const buffer = fs.readFileSync(resumePath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();

    const text = result.text.replace(/\t/g, " ").replace(/\u00a0/g, " ");
    fs.writeFileSync(outTextPath, text, "utf8");

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const email = (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [])[0] || "";
    const links = uniq(text.match(/https?:\/\/[^\s)]+/gi) || []);

    const phoneMatch =
      text.match(/(?:\+91|\+\d{1,3})[-\s]?[6-9]\d{9}/) ||
      text.match(/\b[6-9]\d{9}\b/);

    const name = lines[0] || "";

    const skillsSection = findSection(text, ["skills", "technical skills", "skill set"]);
    const projectsSection = findSection(text, ["projects", "project"]);
    const experienceSection = findSection(text, ["experience", "work experience", "internship", "internships"]);
    const educationSection = findSection(text, ["education", "academic background"]);
    const summarySection = findSection(text, ["summary", "profile", "objective", "about me"]);

    const skillTokens = uniq(
      skillsSection
        .join(" ")
        .split(/[,:|/•]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 1 && item.length < 40)
    );

    const structured = {
      name,
      email,
      phone: phoneMatch ? phoneMatch[0] : "",
      links,
      sections: {
        summary: summarySection,
        education: educationSection,
        experience: experienceSection,
        projects: projectsSection,
        skills: skillsSection
      },
      parsedSkills: skillTokens.slice(0, 30)
    };

    fs.writeFileSync(outJsonPath, JSON.stringify(structured, null, 2), "utf8");

    console.log(`Extracted raw text to: ${outTextPath}`);
    console.log(`Extracted structured JSON to: ${outJsonPath}`);
  } catch (error) {
    console.error("Failed to parse PDF:", error.message);
    process.exit(1);
  }
})();
