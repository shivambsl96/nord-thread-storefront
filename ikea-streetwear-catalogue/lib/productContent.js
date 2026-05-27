const SECTION_LABELS = [
  ["hook", ["hook", "quote", "headline"]],
  ["productStory", ["product story", "story", "description"]],
  ["fabricDetails", ["fabric details", "fabric", "material details"]],
  ["fitDetails", ["fit details", "fit"]],
  ["designInspiration", ["design inspiration", "inspiration", "design notes"]],
  ["careInstructions", ["care instructions", "care"]],
  ["designIntention", ["mood / intention", "mood", "intention", "intention behind the design"]]
];

const SECTION_KEYS = SECTION_LABELS.map(([key]) => key);

export function parseProductDescription(description = "") {
  const text = normalizeDescription(description);
  const sections = {};
  const matches = [];

  for (const [key, labels] of SECTION_LABELS) {
    for (const label of labels) {
      const pattern = new RegExp(`(^|\\n)\\s*${escapeRegExp(label)}\\s*:?\\s*`, "i");
      const match = pattern.exec(text);

      if (match) {
        matches.push({
          key,
          index: match.index + match[0].length,
          labelStart: match.index
        });
        break;
      }
    }
  }

  matches.sort((left, right) => left.index - right.index);

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const value = text
      .slice(current.index, next?.labelStart ?? text.length)
      .trim()
      .replace(/\n{3,}/g, "\n\n");

    if (value) {
      sections[current.key] = value;
    }
  }

  const summary = matches.length
    ? text.slice(0, matches[0].labelStart).trim()
    : text;

  return {
    summary: summary || text,
    sections
  };
}

export function metafieldsToContentMap(metafields = []) {
  return metafields
    .filter(Boolean)
    .reduce((content, metafield) => {
      const key = metafieldKeyToContentKey(metafield.key);

      if (key && metafield.value) {
        content[key] = metafield.value;
      }

      return content;
    }, {});
}

export function resolveProductContent({ parsedSections, metafields, tags, key, tagPrefix, fallback }) {
  return (
    metafields[key] ||
    parsedSections[key] ||
    (tagPrefix ? tagValue(tags, tagPrefix) : "") ||
    fallback
  );
}

export function hasStructuredProductContent(product) {
  return SECTION_KEYS.some((key) => product[key]);
}

function metafieldKeyToContentKey(key = "") {
  return {
    product_story: "productStory",
    hook: "hook",
    fabric_details: "fabricDetails",
    fit_details: "fitDetails",
    design_inspiration: "designInspiration",
    care_instructions: "careInstructions",
    design_intention: "designIntention",
    mood_intention: "designIntention",
    mood: "designIntention",
    gsm: "gsm",
    material: "material"
  }[key];
}

function normalizeDescription(description = "") {
  const value = String(description);
  const text = /<\/?[a-z][\s\S]*>/i.test(value) ? htmlToText(value) : value;

  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function htmlToText(html = "") {
  return String(html)
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function tagValue(tags = [], prefix) {
  const tag = tags.find((item) => item.toLowerCase().startsWith(`${prefix.toLowerCase()}:`));
  return tag?.split(":").slice(1).join(":").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
