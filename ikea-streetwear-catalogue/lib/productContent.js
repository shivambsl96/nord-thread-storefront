const SECTION_LABELS = [
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
    fabric_details: "fabricDetails",
    fit_details: "fitDetails",
    design_inspiration: "designInspiration",
    care_instructions: "careInstructions",
    design_intention: "designIntention",
    mood_intention: "designIntention"
  }[key];
}

function normalizeDescription(description = "") {
  return String(description)
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

function tagValue(tags = [], prefix) {
  const tag = tags.find((item) => item.toLowerCase().startsWith(`${prefix.toLowerCase()}:`));
  return tag?.split(":").slice(1).join(":").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
