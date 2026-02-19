const elInput = document.getElementById("input");
const elStatus = document.getElementById("status");
const elOutputGraphql = document.getElementById("outputGraphql");
const btnCopyGraphql = document.getElementById("btnCopyGraphql");
const btnClear = document.getElementById("btnClear");
const btnBack = document.getElementById("btnBack");
const copyNotification = document.getElementById("copyNotification");
const appEl = document.querySelector(".app");

function setView(view) {
  appEl.setAttribute("data-view", view);
}

function setStatus(type, text) {
  elStatus.classList.remove("ok", "err");
  if (type) elStatus.classList.add(type);
  elStatus.textContent = text ?? "";
}

function showCopyNotification() {
  copyNotification.classList.add("show");
  setTimeout(() => {
    copyNotification.classList.remove("show");
  }, 2000);
}

/**
 * Core logic: extract the GraphQL query and replace literal \r\n with real newlines.
 * That's it — no fancy GraphQL parsing needed.
 */
function formatInput(inputText) {
  const trimmed = inputText.trim();
  if (!trimmed) {
    return { graphql: "", status: { type: null, text: "" } };
  }

  // Try to parse as JSON to extract the "query" field
  let raw = trimmed;
  let wasJson = false;
  try {
    const obj = JSON.parse(trimmed);
    if (obj && typeof obj.query === "string") {
      raw = obj.query;
      wasJson = true;
    }
  } catch {
    // Not JSON — treat entire input as raw GraphQL text
  }

  // The simple regex that does all the work:
  // Replace literal \r\n (and \n, \r) with actual newlines
  const normalized = raw
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // Remove lines that contain only non-curly brackets/punctuation (no actual data)
  // Keep { and } lines as visual group separators
  const formatted =
    normalized
      .split("\n")
      .filter((line) => !/^\s*[\[\](),]*\s*$/.test(line))
      .join("\n")
      .trimEnd() + "\n";

  const statusText = wasJson
    ? "Parsed JSON payload. Formatted GraphQL query."
    : "Formatted as GraphQL.";

  return {
    graphql: formatted,
    status: { type: "ok", text: statusText },
  };
}

function highlightGraphQL(text) {
  if (!text) return "";

  // Escape HTML first
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Collect tokens with positions
  const tokens = [];

  function addMatches(regex, className) {
    const re = new RegExp(regex.source, regex.flags);
    let m;
    while ((m = re.exec(html)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length, className, text: m[0] });
    }
  }

  const keywordSet = new Set([
    "query", "mutation", "subscription", "type", "interface", "union",
    "enum", "input", "scalar", "fragment", "on", "extend", "implements",
    "directive", "schema", "true", "false", "null",
  ]);

  // Order matters: most specific first
  addMatches(/""".*?"""/gs, "gql-comment");
  addMatches(/"(?:[^"\\]|\\.)*"/g, "gql-string");
  addMatches(/'(?:[^'\\]|\\.)*'/g, "gql-string");
  addMatches(/#.*$/gm, "gql-comment");
  addMatches(/\$[a-zA-Z_][a-zA-Z0-9_]*/g, "gql-variable");
  addMatches(/\b\d+\.?\d*\b/g, "gql-number");
  addMatches(
    /\b(query|mutation|subscription|type|interface|union|enum|input|scalar|fragment|on|extend|implements|directive|schema|true|false|null)\b/g,
    "gql-keyword"
  );

  // Field names (word followed by colon)
  const fieldRe = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g;
  let fm;
  while ((fm = fieldRe.exec(html)) !== null) {
    if (!keywordSet.has(fm[1])) {
      tokens.push({ start: fm.index, end: fm.index + fm[0].length, className: "gql-field", text: fm[0] });
    }
  }

  addMatches(/([{}[\]():!@])/g, "gql-punctuation");

  // Sort by position, remove overlaps (keep first)
  tokens.sort((a, b) => a.start - b.start);
  const filtered = [];
  let lastEnd = 0;
  for (const t of tokens) {
    if (t.start >= lastEnd) {
      filtered.push(t);
      lastEnd = t.end;
    }
  }

  // Build result from end to start to preserve indices
  let result = html;
  for (let i = filtered.length - 1; i >= 0; i--) {
    const t = filtered[i];
    result =
      result.slice(0, t.start) +
      `<span class="${t.className}">${t.text}</span>` +
      result.slice(t.end);
  }

  return result;
}

let rafId = 0;
function scheduleRender() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    const res = formatInput(elInput.value);
    elOutputGraphql.innerHTML = highlightGraphQL(res.graphql);
    setStatus(res.status.type, res.status.text);
    
    // Switch to output view if there's content
    if (res.graphql.trim()) {
      setView("output");
    } else {
      setView("input");
    }
  });
}

async function copyText(text) {
  if (!text) return;
  await navigator.clipboard.writeText(text);
}

elInput.addEventListener("input", scheduleRender);

btnClear.addEventListener("click", () => {
  elInput.value = "";
  scheduleRender();
  setView("input");
  elInput.focus();
});

btnBack.addEventListener("click", () => {
  setView("input");
  elInput.focus();
});

btnCopyGraphql.addEventListener("click", async () => {
  try {
    const text = elOutputGraphql.textContent ?? "";
    await copyText(text);
    showCopyNotification(); // Show visual feedback
    setStatus("ok", "Copied formatted GraphQL.");
  } catch (e) {
    setStatus("err", `Copy failed. (${e?.message ?? String(e)})`);
  }
});

// Initial render
scheduleRender();

