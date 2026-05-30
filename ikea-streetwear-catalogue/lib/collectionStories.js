export const collectionStories = [
  {
    handle: "focus",
    shopifyHandle: "focus",
    title: "Focus",
    name: "Focus",
    symbol: "One clear line",
    shortSubtitle: "Sharp, clear, intentional",
    mood: "Clarity / attention / less friction",
    moodWords: ["Sharp", "Clear", "Intentional"],
    shortStory:
      "For deep work, clean routines, and the quiet satisfaction of doing one thing properly.",
    story:
      "Focus is built around reduction: fewer signals, clearer shapes, and pieces that support attention without turning discipline into theatre.",
    themeColor: "#f3ead0",
    textColor: "#111111",
    backgroundPattern: "/assets/patterns/focus-pattern.png",
    heroImage: "/assets/collections/focus-hero.png",
    surfaceClass: "surface-focus",
    accentClass: "bg-accent",
    actionLabel: "Explore Focus",
    sortOrder: 2
  },
  {
    handle: "peace",
    shopifyHandle: "peace",
    title: "Peace",
    name: "Peace",
    symbol: "Soft horizon",
    shortSubtitle: "Soft, breathable, calm",
    mood: "Ease / patience / emotional space",
    moodWords: ["Soft", "Breathable", "Calm"],
    shortStory:
      "A softer edit for days when calm is the point, not a side effect.",
    story:
      "Peace keeps the catalogue quiet and breathable: gentle contrast, soft symbolism, and a wardrobe language that feels settled rather than sleepy.",
    themeColor: "#dfe8dc",
    textColor: "#111111",
    backgroundPattern: "/assets/patterns/peace-pattern.png",
    heroImage: "/assets/collections/peace-hero.png",
    surfaceClass: "surface-peace",
    accentClass: "bg-sky",
    actionLabel: "Explore Peace",
    sortOrder: 1
  },
  {
    handle: "discipline",
    shopifyHandle: "discipline",
    title: "Discipline",
    name: "Discipline",
    symbol: "Daily structure",
    shortSubtitle: "Structured, strong, minimal",
    mood: "Consistency / restraint / useful repetition",
    moodWords: ["Structured", "Strong", "Minimal"],
    shortStory:
      "For steady habits, sharp decisions, and the kind of consistency that does not need to announce itself.",
    story:
      "Discipline avoids hustle noise. It is about dependable rhythm, strong basics, and visual structure that makes the day feel more intentional.",
    themeColor: "#262626",
    textColor: "#fbfaf5",
    backgroundPattern: "/assets/patterns/discipline-pattern.png",
    heroImage: "/assets/collections/discipline-hero.png",
    surfaceClass: "surface-discipline",
    accentClass: "bg-coral",
    actionLabel: "Explore Discipline",
    sortOrder: 4
  },
  {
    handle: "manifest",
    shopifyHandle: "manifesting",
    aliases: ["manifesting"],
    title: "Manifest",
    name: "Manifest",
    symbol: "Quiet intention",
    shortSubtitle: "Soft, aspirational, quietly confident",
    mood: "Possibility / direction / inner alignment",
    moodWords: ["Aspirational", "Quiet", "Aligned"],
    shortStory:
      "A grounded take on intention: clear, modern, and free from performative mysticism.",
    story:
      "Manifest is not about pretending. It is about choosing symbols that help you remember what you are building, then wearing them with restraint.",
    themeColor: "#ebe1ee",
    textColor: "#111111",
    backgroundPattern: "/assets/patterns/manifest-pattern.png",
    heroImage: "/assets/collections/manifest-hero.png",
    surfaceClass: "surface-manifest",
    accentClass: "bg-accent",
    actionLabel: "Explore Manifest",
    sortOrder: 3
  },
  {
    handle: "patience",
    shopifyHandle: "patience",
    title: "Patience",
    name: "Patience",
    symbol: "Quiet timing",
    shortSubtitle: "Measured, soft, quietly steady",
    mood: "Timing / trust / softer consistency",
    moodWords: ["Patient", "Steady", "Soft"],
    shortStory:
      "For the days when becoming better means staying gentle with the process.",
    story:
      "Patience is built around quiet timing: pieces that hold space for trust, softness, and the slow confidence of continuing without rushing the outcome.",
    themeColor: "#f8f3e8",
    textColor: "#111111",
    backgroundPattern: "/assets/patterns/patience-pattern.png",
    heroImage: "/assets/collections/patience-hero.png",
    surfaceClass: "surface-stillness",
    accentClass: "bg-sky",
    actionLabel: "Explore Patience",
    sortOrder: 5
  },
  {
    handle: "growth",
    shopifyHandle: "grow",
    aliases: ["grow"],
    title: "Growth",
    name: "Growth",
    symbol: "Small increments",
    shortSubtitle: "Natural, grounded, upward movement",
    mood: "Progress / reflection / patient change",
    moodWords: ["Natural", "Grounded", "Upward"],
    shortStory:
      "A measured edit for becoming better without becoming louder.",
    story:
      "Growth is patient by design: natural tones, gentle movement, and products that frame self-improvement as care rather than pressure.",
    themeColor: "#d9ddc7",
    textColor: "#111111",
    backgroundPattern: "/assets/patterns/growth-pattern.png",
    heroImage: "/assets/collections/growth-hero.png",
    surfaceClass: "surface-growth",
    accentClass: "bg-coral",
    actionLabel: "Explore Growth",
    sortOrder: 6
  }
];

export const collectionStoryOrder = [...collectionStories]
  .sort((left, right) => left.sortOrder - right.sortOrder)
  .map((collection) => collection.shopifyHandle ?? collection.handle);

export const approvedCollectionHandles = new Set(
  collectionStories.flatMap((collection) => [
    collection.handle,
    collection.shopifyHandle,
    ...(collection.aliases ?? [])
  ].filter(Boolean))
);

export function getCollectionStory(value = "") {
  const normalized = normalizeHandle(value);
  return collectionStories.find(
    (collection) =>
      collection.handle === normalized ||
      collection.shopifyHandle === normalized ||
      (collection.aliases ?? []).includes(normalized) ||
      normalizeHandle(collection.name) === normalized
  );
}

export function getShopifyCollectionHandle(value = "") {
  const story = getCollectionStory(value);
  return story?.shopifyHandle ?? normalizeHandle(value);
}

export function applyCollectionStory(collection) {
  if (!collection) {
    return null;
  }

  const story = getCollectionStory(collection.handle) ?? getCollectionStory(collection.title);
  const fallbackDescription =
    collection.description || "A considered collection from the mindful catalogue.";

  return {
    ...collection,
    shopifyDescription: collection.description,
    title: collection.title ?? story?.title ?? collection.name,
    description: story?.shortStory ?? fallbackDescription,
    shortStory: story?.shortStory ?? fallbackDescription,
    shortSubtitle: story?.shortSubtitle ?? collection.shortSubtitle ?? "Mindful wardrobe edit",
    story: story?.story ?? fallbackDescription,
    mood: story?.mood ?? collection.mood ?? "Considered edit",
    moodWords: story?.moodWords ?? collection.moodWords ?? [],
    symbol: story?.symbol ?? collection.symbol ?? collection.title ?? collection.name,
    themeColor: story?.themeColor ?? collection.themeColor ?? "#fcfcf8",
    textColor: story?.textColor ?? collection.textColor ?? "#111111",
    backgroundPattern: story?.backgroundPattern ?? collection.backgroundPattern ?? "",
    heroImage: story?.heroImage ?? collection.heroImage ?? "",
    surfaceClass: story?.surfaceClass ?? collection.surfaceClass ?? "surface-focus",
    accentClass: story?.accentClass ?? collection.accentClass ?? "bg-accent",
    actionLabel: story?.actionLabel ?? `Shop ${collection.name ?? collection.title}`,
    sortOrder: story?.sortOrder ?? Number.MAX_SAFE_INTEGER,
    storyHandle: story?.handle ?? null,
    canonicalHandle: story?.handle ?? collection.handle
  };
}

export function createPlaceholderCollection(story) {
  return applyCollectionStory({
    id: `placeholder-${story.handle}`,
    handle: story.handle,
    name: story.name,
    title: story.name,
    description: story.shortStory,
    image: null,
    products: [],
    isPlaceholder: true
  });
}

export function mergeCollectionsWithPlaceholders(collections = []) {
  const enrichedCollections = collections
    .filter((collection) => approvedCollectionHandles.has(normalizeHandle(collection.handle)))
    .map(applyCollectionStory)
    .filter(Boolean);

  return orderCollectionsByStories(enrichedCollections);
}

export function orderCollectionsByStories(collections = []) {
  return [...collections].sort((left, right) => {
    const leftRank = collectionRank(left);
    const rightRank = collectionRank(right);

    if (leftRank !== rightRank) {
      return leftRank - rightRank;
    }

    return (left.name ?? left.title ?? "").localeCompare(right.name ?? right.title ?? "");
  });
}

function collectionRank(collection) {
  const story =
    getCollectionStory(collection.storyHandle) ??
    getCollectionStory(collection.handle) ??
    getCollectionStory(collection.title);
  const storyHandle = story?.shopifyHandle ?? story?.handle;
  const index = storyHandle ? collectionStoryOrder.indexOf(storyHandle) : -1;
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function normalizeHandle(value = "") {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
