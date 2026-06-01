// Linklaters 50 · Cocktail Quiz — alternative editorial direction
// Same content & quiz logic as the primary build; different presentation.

const QUESTIONS = [
  {
    id: "q1", num: "01", eyebrow: "Question One",
    tc: "今晚的氛圍？", en: "What's your vibe tonight?",
    options: [
      { key: "cocktail", tc: "雞尾酒", en: "Feeling festive — cocktail" },
      { key: "mocktail", tc: "無酒精", en: "Keeping it cool — mocktail" },
    ],
  },
  {
    id: "q2", num: "02", eyebrow: "Question Two",
    tc: "您屬於哪個元素？", en: "Which element represents you best?",
    options: [
      { key: "earth", tc: "土", en: "Earth — grounded and steady" },
      { key: "fire",  tc: "火", en: "Fire — bold and driven" },
      { key: "air",   tc: "風", en: "Air — creative and adaptable" },
      { key: "water", tc: "水", en: "Water — calm and flexible" },
    ],
  },
  {
    id: "q3", num: "03", eyebrow: "Question Three",
    tc: "一個字形容Linklaters", en: "Linklaters in one word?",
    options: [
      { key: "resourceful", tc: "機智", en: "Resourceful" },
      { key: "creative",    tc: "創意", en: "Creative" },
      { key: "top",         tc: "頂級", en: "Top drawer" },
      { key: "all",         tc: "全部", en: "All of the above" },
    ],
  },
  {
    id: "q4", num: "04", eyebrow: "Question Four",
    tc: "最有香港味的是？", en: "Which of these says Hong Kong best?",
    options: [
      { key: "milk_tea",      tc: "港式奶茶", en: "Hong Kong-style milk tea" },
      { key: "pineapple_bun", tc: "菠蘿包",   en: "Pineapple bun" },
      { key: "egg_tart",      tc: "蛋撻",     en: "Egg tart" },
      { key: "dim_sum",       tc: "點心",     en: "Dim sum" },
    ],
  },
];

const DRINKS = {
  cocktail: {
    fire:  { name: "Magenta",         ingredients: ["Gin", "Lemon Juice", "Butterfly Pea Flower Water", "Club Soda"], colors: ["#FDB6DE", "#FD3DB5", "#8C0E69"], garnish: "lemon_flower", note: "A sparkling citrus floral serve with a vivid magenta finish." },
    air:   { name: "Golden 50",       ingredients: ["Vodka", "Lemon", "Pineapple", "Syrup"],                          colors: ["#FCE9A8", "#E8B84A", "#A87822"], garnish: "pineapple",    note: "A radiant pineapple sipper — bright, golden, and celebratory." },
    water: { name: "Harbour View",    ingredients: ["Vodka", "Blue Curaçao", "Lemon"],                                 colors: ["#BFE7FA", "#3FA3DC", "#1A4F8C"], garnish: "lemon",        note: "Cool, clear, and luminous — like the harbour at twilight." },
    earth: { name: "Central Reserve", ingredients: ["Gin", "Lemon", "Cranberry", "Syrup"],                             colors: ["#F5C5C5", "#D24A6A", "#7A1B33"], garnish: "cranberry",    note: "Grounded, tart, and quietly confident — the city's heart in a glass." },
  },
  mocktail: {
    fire:  { name: "Lion Rock",      ingredients: ["Pineapple", "Lemon", "Club Soda"],                  colors: ["#FCE9A8", "#E8B84A", "#9E6A1F"], garnish: "pineapple",    note: "Bold and bright — a sun-kissed Hong Kong landmark in a glass." },
    air:   { name: "Glowy",          ingredients: ["Lychee", "Lemon", "Club Soda"],                     colors: ["#FFFFFF", "#F8D7E6", "#E89BBE"], garnish: "lychee",       note: "Soft, airy, and lightly floral — gently glowing on the palate." },
    water: { name: "Victoria Pulse", ingredients: ["Lemon Juice", "Butterfly Pea Flower Water", "Soda"], colors: ["#C9D6F2", "#5E7BD6", "#2A3F8F"], garnish: "lemon_flower", note: "Calm, blue, and shimmering — a slow pulse across the harbour." },
    earth: { name: "Sunset Peak",    ingredients: ["Orange", "Grapefruit", "Club Soda"],                colors: ["#FFD7A8", "#F58A4B", "#B83B1F"], garnish: "orange",       note: "Warm citrus glow — grounded, generous, and sun-drenched." },
  },
};

/* ====================== state ====================== */
const answers = {};
const history = [];

const stage     = document.getElementById("stage");
const page      = document.getElementById("page");
const footer    = document.getElementById("pageFooter");
const progress  = document.getElementById("progress");
const backBtn   = document.getElementById("backBtn");

backBtn.addEventListener("click", navigateBack);

function navigateBack() {
  if (history.length <= 1) return;
  history.pop();
  render(history[history.length - 1], { skipHistory: true });
}

function render(view, opts = {}) {
  if (!opts.skipHistory) history.push(view);

  const kind = view === "landing" ? "landing" : (view === "result" ? "result" : "question");
  stage.setAttribute("data-view", kind);
  footer.hidden = kind === "landing";

  page.classList.remove("fade-in");
  void page.offsetWidth;
  page.classList.add("fade-in");

  // back button visibility
  backBtn.style.visibility = history.length > 1 ? "visible" : "hidden";

  if (view !== "landing") removeLandingTap();
  if (view === "landing") return renderLanding();
  if (view === "result")  return renderResult();
  const q = QUESTIONS.find((x) => x.id === view);
  if (q) return renderQuestion(q);
}

/* ====================== element helper ====================== */
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function svgEl(attrs, inner) {
  const ns = "http://www.w3.org/2000/svg";
  const s = document.createElementNS(ns, "svg");
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  s.innerHTML = inner;
  return s;
}

/* ====================== landing ====================== */
function renderLanding() {
  const start = () => { Object.keys(answers).forEach(k => delete answers[k]); history.length = 0; render("q1"); };

  page.replaceChildren(
    el("h1", { class: "landing-title", html:
      'Discover your <em>signature sip</em><br/>for the evening.'
    }),
    el("button", {
      class: "landing-art",
      type: "button",
      "aria-label": "Begin the tasting",
      onclick: start,
    }, landingArt()),
  );
}

function removeLandingTap() { /* no-op kept for callers */ }

function landingArt() {
  // Fantasy line-art cocktail composition — twin glasses, botanicals, stars, citrus, swirls
  return svgEl(
    { viewBox: "0 0 480 540", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" },
    `
    <defs>
      <linearGradient id="liq1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#FDB6DE" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#FD3DB5" stop-opacity="0.85"/>
      </linearGradient>
      <linearGradient id="liq2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stop-color="#FFE7F4" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#FD3DB5" stop-opacity="0.6"/>
      </linearGradient>
      <radialGradient id="halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FD3DB5" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#FD3DB5" stop-opacity="0"/>
      </radialGradient>
      <symbol id="star4" viewBox="-10 -10 20 20">
        <path d="M0 -10 C 1.5 -2 2 -1.5 10 0 C 2 1.5 1.5 2 0 10 C -1.5 2 -2 1.5 -10 0 C -2 -1.5 -1.5 -2 0 -10 Z" fill="#FD3DB5"/>
      </symbol>
      <symbol id="sparkle" viewBox="-10 -10 20 20">
        <circle cx="0" cy="0" r="1.6" fill="#FD3DB5"/>
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#FD3DB5" stroke-width="0.7"/>
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#FD3DB5" stroke-width="0.7"/>
      </symbol>
    </defs>

    <!-- soft halo behind the composition -->
    <ellipse cx="240" cy="290" rx="230" ry="180" fill="url(#halo)"/>

    <!-- decorative swirls top -->
    <g fill="none" stroke="#FD3DB5" stroke-width="1.2" stroke-linecap="round" opacity="0.85">
      <path d="M30 60 C 90 30, 130 90, 80 120 C 40 140, 70 80, 110 90"/>
      <path d="M450 70 C 400 50, 360 120, 410 140 C 450 150, 430 100, 400 110"/>
      <path d="M40 470 C 90 440, 140 480, 110 510"/>
      <path d="M440 470 C 390 440, 340 480, 370 510"/>
    </g>

    <!-- scattered stars + sparkles -->
    <g opacity="0.95">
      <use href="#star4" x="60"  y="40"  width="22" height="22"/>
      <use href="#star4" x="420" y="30"  width="18" height="18"/>
      <use href="#star4" x="410" y="330" width="26" height="26"/>
      <use href="#star4" x="40"  y="320" width="16" height="16"/>
      <use href="#sparkle" x="100" y="200" width="22" height="22"/>
      <use href="#sparkle" x="380" y="200" width="22" height="22"/>
      <use href="#sparkle" x="230" y="60"  width="18" height="18"/>
      <use href="#sparkle" x="230" y="500" width="18" height="18"/>
      <circle cx="180" cy="30"  r="2.5" fill="#FD3DB5"/>
      <circle cx="310" cy="40"  r="2"   fill="#FD3DB5"/>
      <circle cx="50"  cy="230" r="2"   fill="#FD3DB5"/>
      <circle cx="440" cy="260" r="2.5" fill="#FD3DB5"/>
    </g>

    <!-- botanical sprigs left + right -->
    <g fill="none" stroke="#C81C8C" stroke-width="1.2" stroke-linecap="round" opacity="0.85">
      <g transform="translate(20,260)">
        <path d="M0 200 C 10 140, 20 90, 0 10"/>
        <ellipse cx="-12" cy="60"  rx="12" ry="5" transform="rotate(-30 -12 60)"/>
        <ellipse cx="14"  cy="100" rx="12" ry="5" transform="rotate(30 14 100)"/>
        <ellipse cx="-10" cy="140" rx="10" ry="4" transform="rotate(-20 -10 140)"/>
        <ellipse cx="10"  cy="180" rx="10" ry="4" transform="rotate(20 10 180)"/>
        <circle cx="0" cy="6" r="6" fill="#FD3DB5" stroke="none" opacity="0.85"/>
      </g>
      <g transform="translate(460,260)">
        <path d="M0 200 C -10 140, -20 90, 0 10"/>
        <ellipse cx="12"  cy="60"  rx="12" ry="5" transform="rotate(30 12 60)"/>
        <ellipse cx="-14" cy="100" rx="12" ry="5" transform="rotate(-30 -14 100)"/>
        <ellipse cx="10"  cy="140" rx="10" ry="4" transform="rotate(20 10 140)"/>
        <ellipse cx="-10" cy="180" rx="10" ry="4" transform="rotate(-20 -10 180)"/>
        <circle cx="0" cy="6" r="6" fill="#FD3DB5" stroke="none" opacity="0.85"/>
      </g>
    </g>

    <!-- ============ MARTINI (left) ============ -->
    <g transform="translate(70,140)" fill="none" stroke="#FD3DB5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <!-- liquid -->
      <path d="M5 5 L155 5 L80 95 Z" fill="url(#liq1)"/>
      <!-- meniscus highlight -->
      <path d="M20 12 C 50 22, 110 22, 140 12" stroke-opacity="0.55" stroke-width="1"/>
      <!-- bowl outline -->
      <path d="M0 0 L160 0 L80 100 Z"/>
      <!-- stem -->
      <line x1="80" y1="100" x2="80" y2="210"/>
      <!-- base -->
      <ellipse cx="80" cy="218" rx="50" ry="6"/>
      <line x1="80" y1="212" x2="80" y2="224" stroke-opacity="0.4"/>
      <!-- olive on pick -->
      <line x1="110" y1="55" x2="140" y2="-15" stroke-width="1.2"/>
      <circle cx="108" cy="58" r="7" fill="#FD3DB5" stroke-width="0"/>
      <circle cx="108" cy="58" r="7"/>
      <circle cx="105" cy="55" r="1.5" fill="#FFE7F4" stroke-width="0"/>
      <!-- droplets / bubbles -->
      <circle cx="50" cy="30" r="2" fill="#FD3DB5" stroke-width="0" opacity="0.7"/>
      <circle cx="75" cy="55" r="1.6" fill="#FD3DB5" stroke-width="0" opacity="0.7"/>
      <circle cx="95" cy="35" r="1.4" fill="#FD3DB5" stroke-width="0" opacity="0.7"/>
      <!-- decorative sparkle -->
      <g transform="translate(40,80)" stroke-width="1" opacity="0.85">
        <line x1="-8" y1="0" x2="8" y2="0"/>
        <line x1="0" y1="-8" x2="0" y2="8"/>
      </g>
    </g>

    <!-- ============ HIGHBALL (right) ============ -->
    <g transform="translate(280,130)" fill="none" stroke="#FD3DB5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <!-- liquid fill -->
      <path d="M3 25 L3 218 Q 3 222 7 222 L 113 222 Q 117 222 117 218 L 117 25 Z" fill="url(#liq2)"/>
      <!-- glass body -->
      <path d="M0 6 L0 220 Q 0 230 10 230 L 110 230 Q 120 230 120 220 L 120 6"/>
      <!-- rim ellipse -->
      <ellipse cx="60" cy="6" rx="60" ry="10"/>
      <ellipse cx="60" cy="6" rx="54" ry="7" stroke-opacity="0.55" stroke-width="1"/>
      <!-- citrus wheel on rim -->
      <g transform="translate(92,4)">
        <circle cx="0" cy="0" r="18" fill="#FFE7F4" stroke-width="1.6"/>
        <circle cx="0" cy="0" r="13" stroke-width="0.9" stroke-opacity="0.7"/>
        <line x1="-13" y1="0" x2="13" y2="0" stroke-width="0.7"/>
        <line x1="0" y1="-13" x2="0" y2="13" stroke-width="0.7"/>
        <line x1="-9" y1="-9" x2="9" y2="9" stroke-width="0.7"/>
        <line x1="-9" y1="9" x2="9" y2="-9" stroke-width="0.7"/>
      </g>
      <!-- ice cubes -->
      <g stroke-width="1.4">
        <rect x="22" y="60" width="30" height="30" rx="3" transform="rotate(15 37 75)" fill="#FFE7F4" fill-opacity="0.6"/>
        <rect x="60" y="100" width="30" height="30" rx="3" transform="rotate(-12 75 115)" fill="#FFE7F4" fill-opacity="0.6"/>
        <rect x="30" y="140" width="28" height="28" rx="3" transform="rotate(8 44 154)" fill="#FFE7F4" fill-opacity="0.6"/>
        <rect x="70" y="170" width="26" height="26" rx="3" transform="rotate(-18 83 183)" fill="#FFE7F4" fill-opacity="0.6"/>
      </g>
      <!-- straw -->
      <line x1="40" y1="-12" x2="50" y2="34" stroke-width="1.5"/>
      <line x1="50" y1="34" x2="55" y2="170" stroke-width="1.5"/>
      <!-- bubbles -->
      <g fill="#FD3DB5" stroke-width="0" opacity="0.7">
        <circle cx="20" cy="180" r="2"/>
        <circle cx="35" cy="205" r="1.5"/>
        <circle cx="100" cy="195" r="2"/>
        <circle cx="85" cy="215" r="1.6"/>
      </g>
      <!-- swirl decoration on glass -->
      <path d="M105 50 C 115 60, 105 80, 95 70" stroke-opacity="0.5" stroke-width="1"/>
    </g>

    <!-- ground shadow connecting both glasses -->
    <ellipse cx="240" cy="480" rx="170" ry="6" fill="#FD3DB5" opacity="0.08"/>
    `
  );
}

/* ====================== question ====================== */
function renderQuestion(q) {
  const idx = QUESTIONS.findIndex((x) => x.id === q.id);

  const grid = el("div", { class: "answers cols-" + q.options.length });
  q.options.forEach((opt) => {
    grid.appendChild(
      el("button", {
        class: "answer", type: "button",
        onclick: () => handleAnswer(q.id, opt.key),
      },
        el("div", { class: "a-en" }, opt.en),
      )
    );
  });

  page.replaceChildren(
    el("div", { class: "q-head" },
      el("div", { class: "q-eyebrow" }, q.eyebrow),
      el("div", { class: "q-num" }, q.num),
      el("div", { class: "q-en" }, q.en),
    ),
    grid,
  );

  renderProgress(idx);
}

function renderProgress(currentIdx) {
  progress.replaceChildren(
    ...QUESTIONS.map((_, i) => {
      const c = i < currentIdx ? "pip is-done" : (i === currentIdx ? "pip is-current" : "pip");
      return el("span", { class: c });
    })
  );
}

function handleAnswer(qid, key) {
  answers[qid] = key;
  const idx = QUESTIONS.findIndex((q) => q.id === qid);
  if (idx < QUESTIONS.length - 1) render(QUESTIONS[idx + 1].id);
  else render("result");
}

/* ====================== result ====================== */
function chosenDrink() {
  const category = answers.q1 || "cocktail";
  const element  = answers.q2 || "fire";
  return { category, element, drink: DRINKS[category][element] };
}
function personalisedNote(base) {
  const adj3 = {
    resourceful: "resourceful", creative: "creative",
    top: "top-drawer", all: "all-rounded",
  }[answers.q3] || "spirited";
  const hk = {
    milk_tea:      "with the warmth of a Hong Kong milk tea afternoon",
    pineapple_bun: "with the comfort of a fresh pineapple bun",
    egg_tart:      "with the golden crust of a classic egg tart",
    dim_sum:       "with the shared joy of a dim sum table",
  }[answers.q4] || "with the spirit of Hong Kong";
  return `${base} For the ${adj3} you — ${hk}.`;
}

function renderResult() {
  const { category, drink } = chosenDrink();
  const label = category === "cocktail" ? "Your Signature Cocktail" : "Your Signature Mocktail";

  page.replaceChildren(
    el("div", { class: "r-eyebrow" }, label),
    el("div", { class: "r-divider" }),
    el("div", { class: "r-name" }, drink.name),
    el("div", { class: "r-ing" }, drink.ingredients.join("   ·   ")),
    resultGlassBlock(drink, category),
    el("p", { class: "r-note" }, personalisedNote(drink.note)),
    el("button", {
      class: "r-cta", type: "button",
      onclick: () => { history.length = 0; render("landing"); },
    }, "Take the quiz again"),
  );

  // Hide question progress on result; keep back button
  progress.replaceChildren();
}

function resultGlassBlock(drink, category) {
  const wrap = el("div", { class: "r-glass-wrap" });
  wrap.appendChild(botanical("left"));
  wrap.appendChild(botanical("right"));
  wrap.appendChild(glass(drink, category));
  return wrap;
}

/* ====================== SVG illustrations ====================== */
function botanical(side) {
  return svgEl(
    { class: "r-botanical " + side, viewBox: "0 0 160 220", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" },
    `<g fill="none" stroke="#C81C8C" stroke-width="1.1" opacity="0.85">
       <path d="M80 210 C 70 160, 60 110, 80 30"/>
       <path d="M80 170 C 50 160, 30 140, 25 110" />
       <ellipse cx="35" cy="120" rx="14" ry="6" transform="rotate(-30 35 120)"/>
       <ellipse cx="55" cy="150" rx="12" ry="5" transform="rotate(-20 55 150)"/>
       <path d="M80 130 C 110 125, 130 105, 135 80" />
       <ellipse cx="125" cy="90" rx="14" ry="6" transform="rotate(30 125 90)"/>
       <ellipse cx="105" cy="115" rx="12" ry="5" transform="rotate(20 105 115)"/>
       <circle cx="80" cy="40" r="10"/>
       <circle cx="80" cy="40" r="4" fill="#FD3DB5" stroke="none"/>
     </g>`
  );
}

function glass(drink, category) {
  const [c1, c2, c3] = drink.colors;
  const id = "g" + Math.random().toString(36).slice(2, 8);
  const isCocktail = category === "cocktail";
  return svgEl(
    { class: "glass", viewBox: "0 0 220 300", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" },
    `<defs>
      <linearGradient id="${id}-d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="${c1}" stop-opacity="0.95"/>
        <stop offset="55%"  stop-color="${c2}" stop-opacity="0.98"/>
        <stop offset="100%" stop-color="${c3}" stop-opacity="1"/>
      </linearGradient>
      <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%"  stop-color="#FFFFFF" stop-opacity="0.85"/>
        <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.7"/>
      </linearGradient>
      <radialGradient id="${id}-h" cx="50%" cy="50%" r="55%">
        <stop offset="0%"  stop-color="${c2}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="${c2}" stop-opacity="0"/>
      </radialGradient>
      <clipPath id="${id}-c">
        <rect x="48" y="58" width="124" height="200" rx="6"/>
      </clipPath>
    </defs>

    ${isCocktail ? `<ellipse cx="110" cy="170" rx="130" ry="120" fill="url(#${id}-h)"/>` : ""}

    <g clip-path="url(#${id}-c)">
      <rect x="48" y="80" width="124" height="180" fill="url(#${id}-d)"/>
      <g fill="#FFFFFF" fill-opacity="0.55" stroke="#FFFFFF" stroke-opacity="0.7">
        <rect x="65"  y="95"  width="34" height="34" rx="4" transform="rotate(16 82 112)"/>
        <rect x="110" y="118" width="34" height="34" rx="4" transform="rotate(-12 127 135)"/>
        <rect x="78"  y="150" width="32" height="32" rx="4" transform="rotate(8 94 166)"/>
        <rect x="120" y="180" width="28" height="28" rx="4" transform="rotate(-18 134 194)"/>
      </g>
      <g fill="#FFFFFF" fill-opacity="0.7">
        <circle cx="70"  cy="220" r="3"/>
        <circle cx="80"  cy="240" r="2"/>
        <circle cx="95"  cy="210" r="2.5"/>
        <circle cx="120" cy="230" r="3"/>
        <circle cx="140" cy="215" r="2"/>
        <circle cx="150" cy="245" r="2.5"/>
        <circle cx="105" cy="250" r="2"/>
        <circle cx="60"  cy="200" r="2"/>
      </g>
    </g>

    <g fill="none" stroke="#FFFFFF" stroke-opacity="0.95" stroke-width="2">
      <rect x="48" y="58" width="124" height="200" rx="6" fill="url(#${id}-g)" fill-opacity="0.25"/>
      <ellipse cx="110" cy="58" rx="62" ry="8" fill="#FFFFFF" fill-opacity="0.55"/>
    </g>
    <ellipse cx="110" cy="266" rx="70" ry="6" fill="#000" fill-opacity="0.08"/>

    ${garnish(drink.garnish)}
    `
  );
}

function garnish(kind) {
  switch (kind) {
    case "lemon_flower":
      return `<g transform="translate(60,30)">
          <path d="M0 0 C 10 -10 30 -10 40 0 C 30 10 10 10 0 0 Z" fill="#F2C95B" stroke="#B79A61"/>
          <path d="M40 0 C 60 -20 90 -10 100 10" fill="none" stroke="#E8B84A" stroke-width="3"/>
        </g>
        <g transform="translate(135,30)">
          <ellipse cx="0" cy="0" rx="14" ry="20" fill="#7A2BBE" opacity="0.95"/>
          <ellipse cx="-10" cy="-4" rx="10" ry="14" fill="#5B1E94" opacity="0.85"/>
          <ellipse cx="10" cy="-4" rx="10" ry="14" fill="#9B4DD6" opacity="0.85"/>
          <circle cx="0" cy="2" r="3" fill="#FFE066"/>
        </g>`;
    case "pineapple":
      return `<g transform="translate(135,30)">
          <path d="M0 0 L -8 -28 L 0 -22 L 8 -32 L 0 0 Z" fill="#7BB661" stroke="#4F7A3F"/>
          <ellipse cx="0" cy="6" rx="14" ry="10" fill="#F2C95B" stroke="#B79A61"/>
        </g>`;
    case "lemon":
      return `<g transform="translate(140,32)">
          <circle cx="0" cy="0" r="16" fill="#F2D75B" stroke="#B79A61" stroke-width="1.5"/>
          <g stroke="#B79A61" stroke-width="0.8" opacity="0.6">
            <line x1="-12" y1="0" x2="12" y2="0"/>
            <line x1="0" y1="-12" x2="0" y2="12"/>
            <line x1="-9" y1="-9" x2="9" y2="9"/>
            <line x1="-9" y1="9" x2="9" y2="-9"/>
          </g>
        </g>`;
    case "cranberry":
      return `<g transform="translate(130,28)">
          <circle cx="0" cy="0" r="10" fill="#C42A4F"/>
          <circle cx="14" cy="6" r="9" fill="#A41A3E"/>
          <circle cx="-12" cy="8" r="8" fill="#D2415F"/>
          <path d="M0 -10 L 4 -22" stroke="#5C8B3A" stroke-width="2"/>
          <ellipse cx="6" cy="-22" rx="6" ry="3" fill="#5C8B3A" transform="rotate(30 6 -22)"/>
        </g>`;
    case "lychee":
      return `<g transform="translate(135,32)">
          <circle cx="0" cy="0" r="14" fill="#FBE9F1" stroke="#E89BBE" stroke-width="1.2"/>
          <circle cx="-4" cy="-2" r="3" fill="#E89BBE" opacity="0.4"/>
          <circle cx="5" cy="3" r="2" fill="#E89BBE" opacity="0.4"/>
        </g>`;
    case "orange":
      return `<g transform="translate(140,32)">
          <circle cx="0" cy="0" r="16" fill="#F58A4B" stroke="#B85D27" stroke-width="1.5"/>
          <g stroke="#B85D27" stroke-width="0.8" opacity="0.6">
            <line x1="-12" y1="0" x2="12" y2="0"/>
            <line x1="0" y1="-12" x2="0" y2="12"/>
            <line x1="-9" y1="-9" x2="9" y2="9"/>
            <line x1="-9" y1="9" x2="9" y2="-9"/>
          </g>
        </g>`;
    default: return "";
  }
}

/* ====================== sparkles ====================== */
(function buildSparkles() {
  const host = document.createElement("div");
  host.className = "sparkles";
  const count = 18;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    const size = 3 + Math.random() * 5;
    s.style.width = s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.bottom = (-10 + Math.random() * 30) + "%";
    s.style.animationDuration = (12 + Math.random() * 14) + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    s.style.opacity = String(0.35 + Math.random() * 0.45);
    host.appendChild(s);
  }
  document.getElementById("stage").appendChild(host);
})();

/* ====================== boot ====================== */
render("landing");
