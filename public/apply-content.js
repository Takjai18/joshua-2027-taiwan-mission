function text(id, value) {
  const el = document.getElementById(id);
  if (el && typeof value === "string") el.textContent = value;
}

function multiline(id, value) {
  const el = document.getElementById(id);
  if (!el || typeof value !== "string") return;
  const lines = value.split("\n");
  el.replaceChildren();
  lines.forEach(function (line, index) {
    if (index) el.append(document.createElement("br"));
    el.append(document.createTextNode(line));
  });
}

function phoneLink(label, digits) {
  const wrap = document.createElement("span");
  wrap.append(document.createTextNode(label + " "));
  if (digits) {
    const link = document.createElement("a");
    link.href = "tel:+852" + digits;
    link.textContent = digits.replace(/(\d{4})(\d{4})/, "$1 $2");
    wrap.append(link);
  }
  return wrap;
}

function tag(textValue, color) {
  const span = document.createElement("span");
  span.className = "pb-tag tag-" + (color || "blue") + " mb-1";
  span.textContent = textValue;
  return span;
}

function applyFlight(prefix, flight) {
  text(prefix + "-badge", flight.badge);
  text(prefix + "-date", flight.date);
  text(prefix + "-depart-time", flight.departTime);
  text(prefix + "-depart-place", flight.departPlace);
  text(prefix + "-meta", flight.meta);
  text(prefix + "-arrive-time", flight.arriveTime);
  text(prefix + "-arrive-place", flight.arrivePlace);
  text(prefix + "-note", flight.note);
}

function applyDays(days) {
  const tabs = document.getElementById("day-tabs");
  const panels = document.getElementById("day-panels");
  if (!tabs || !panels || !Array.isArray(days)) return;
  tabs.replaceChildren();
  panels.replaceChildren();
  days.forEach(function (day, index) {
    const id = "day" + (index + 1);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-btn pb-btn bg-[var(--" + day.color + ")] px-5 py-2 text-lg flex-shrink-0";
    if (index === 0) button.id = "defaultOpen";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", id);
    button.textContent = day.tab;
    button.addEventListener("click", function (event) { openTab(event, id); });
    tabs.append(button);

    const panel = document.createElement("div");
    panel.id = id;
    panel.className = "tab-content";
    panel.setAttribute("role", "tabpanel");
    const heading = document.createElement("h3");
    heading.className = "text-xl font-extrabold mb-6 border-b-2 border-dashed border-[#3E3A39] pb-2";
    heading.textContent = day.title;
    const timeline = document.createElement("div");
    timeline.className = "timeline-container";
    day.items.forEach(function (item) {
      const row = document.createElement("div");
      row.className = "timeline-item" + (item.focus ? " must-go" : "");
      if (item.tag) row.append(tag(item.tag, item.tagColor));
      if (item.tag2) row.append(tag(item.tag2, item.tag2Color));
      const title = document.createElement("h4");
      title.className = "font-bold text-lg";
      title.textContent = item.title;
      const body = document.createElement("p");
      body.className = "text-sm";
      body.textContent = item.body;
      row.append(title, body);
      timeline.append(row);
    });
    panel.append(heading, timeline);
    panels.append(panel);
  });
  const first = document.getElementById("defaultOpen");
  if (first && typeof openTab === "function") openTab({ currentTarget: first }, "day1");
}

function todoItem(entry) {
  const li = document.createElement("li");
  const label = document.createElement("label");
  label.className = "flex items-start gap-2 cursor-pointer";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "pb-checkbox mt-0.5";
  input.dataset.id = entry.id;
  const key = "joshua2027_" + entry.id;
  input.checked = localStorage.getItem(key) === "true";
  input.addEventListener("change", function () {
    localStorage.setItem(key, input.checked);
    renderTodoProgress();
  });
  const span = document.createElement("span");
  span.textContent = entry.label;
  label.append(input, span);
  li.append(label);
  return li;
}

function applyTodos(todos) {
  const list = document.getElementById("todo-list");
  if (!list || !todos) return;
  const nodes = [];
  (todos.docs || []).forEach(function (entry) { nodes.push(todoItem(entry)); });
  const bagHeading = document.createElement("li");
  bagHeading.className = "pt-2";
  const bagTitle = document.createElement("h3");
  bagTitle.className = "font-extrabold text-sm";
  bagTitle.textContent = "行李";
  bagHeading.append(bagTitle);
  nodes.push(bagHeading);
  (todos.bags || []).forEach(function (entry) { nodes.push(todoItem(entry)); });
  list.replaceChildren.apply(list, nodes);
  renderTodoProgress();
}

function applyMilestones(items) {
  const list = document.getElementById("milestone-list");
  if (!list || !Array.isArray(items)) return;
  list.replaceChildren();
  items.forEach(function (item) {
    const row = document.createElement("div");
    row.className = "timeline-item" + (item.focus ? " must-go" : "");
    if (item.tag) row.append(tag(item.tag, item.color));
    const title = document.createElement("h3");
    title.className = "font-bold text-lg";
    title.textContent = item.title;
    const body = document.createElement("p");
    body.className = "text-sm";
    body.textContent = item.body;
    row.append(title, body);
    list.append(row);
  });
}

function applyPrayers(items) {
  const list = document.getElementById("prayer-list");
  if (!list || !Array.isArray(items)) return;
  list.replaceChildren();
  items.forEach(function (item) {
    const li = document.createElement("li");
    if (item.tag) li.append(tag(item.tag, item.color));
    li.append(document.createTextNode(" " + item.text));
    list.append(li);
  });
}

function applyNotes(notes, emergency) {
  const list = document.getElementById("notes-list");
  if (!list) return;
  list.replaceChildren();
  (notes || []).forEach(function (note) {
    const block = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "font-bold text-lg";
    title.textContent = note.title;
    const body = document.createElement("p");
    body.className = "text-sm";
    body.textContent = note.body + (note.linkLabel ? " " : "");
    if (note.linkLabel && note.linkUrl) {
      const link = document.createElement("a");
      link.className = "font-bold underline";
      link.href = note.linkUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = note.linkLabel;
      body.append(link);
    }
    block.append(title, body);
    list.append(block);
  });
  if (!emergency) return;
  const box = document.createElement("div");
  box.className = "soft-box";
  box.style.background = "#FDE8E3";
  const title = document.createElement("h3");
  title.className = "font-extrabold text-lg mb-1";
  title.textContent = "緊急聯絡";
  const leader = document.createElement("p");
  leader.className = "font-bold";
  leader.append(phoneLink(emergency.leaderLabel, emergency.leaderPhone));
  const church = document.createElement("p");
  church.className = "text-sm font-bold";
  church.append(phoneLink(emergency.churchLabel, emergency.churchPhone));
  if (emergency.churchDetail) church.append(document.createTextNode(" · " + emergency.churchDetail));
  const local = document.createElement("p");
  local.className = "text-sm mt-1";
  local.textContent = emergency.local;
  box.append(title, leader, church, local);
  list.append(box);
}

function applyBudget(items) {
  const list = document.getElementById("budget-list");
  if (!list || !Array.isArray(items)) return;
  list.replaceChildren();
  items.forEach(function (item) {
    const li = document.createElement("li");
    li.className = "flex justify-between gap-3 items-center";
    const name = document.createElement("span");
    name.textContent = item.name;
    li.append(name, tag(item.tag, item.color));
    list.append(li);
  });
}

function applyMaps(items) {
  const list = document.getElementById("map-links");
  if (!list || !Array.isArray(items)) return;
  list.replaceChildren();
  items.forEach(function (item) {
    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "pb-btn bg-[var(--" + item.color + ")] px-4 py-2 text-center";
    link.textContent = item.label;
    list.append(link);
  });
}

function applyFaqs(items) {
  const list = document.getElementById("faq-list");
  if (!list || !Array.isArray(items)) return;
  list.replaceChildren();
  items.forEach(function (item) {
    const block = document.createElement("div");
    const q = document.createElement("h3");
    q.className = "font-bold";
    q.textContent = item.q;
    const a = document.createElement("p");
    a.className = "text-sm";
    a.textContent = item.a;
    block.append(q, a);
    list.append(block);
  });
}

function applyHeroTags(tags) {
  const list = document.getElementById("hero-tags");
  if (!list || !Array.isArray(tags)) return;
  const colors = ["yellow", "blue", "green", "pink"];
  list.replaceChildren();
  tags.forEach(function (label, index) {
    const span = document.createElement("span");
    span.className = "pb-tag tag-" + colors[index % colors.length];
    span.textContent = label;
    list.append(span);
  });
}

function applyFooter(footer) {
  text("footer-line1", footer.line1);
  text("footer-line3", footer.line3);
  const leader = document.getElementById("footer-leader");
  if (!leader) return;
  const leaderLabel = footer.leaderLabel ? footer.leaderLabel + " ·" : "";
  leader.replaceChildren(phoneLink(leaderLabel, footer.leaderPhone));
}

function renderSiteContent(content) {
  const hero = content.hero || {};
  text("hero-badge", hero.badge);
  multiline("hero-title", hero.title);
  text("hero-date-start", hero.dateStart);
  text("hero-date-end", hero.dateEnd);
  text("hero-summary", hero.summary);
  text("hero-leader", hero.leader);
  applyHeroTags(hero.tags);
  text("countdown-note", hero.countdownNote);
  if (hero.departAt && typeof window.setDepart === "function") window.setDepart(hero.departAt);
  const about = content.about || {};
  text("about-purpose", about.purpose);
  text("about-hope", about.hope);
  text("about-verse", about.verse);
  text("about-verse-ref", about.verseRef);
  text("about-note", about.note);
  if (content.transport) {
    applyFlight("out", content.transport.outbound || {});
    applyFlight("in", content.transport.inbound || {});
    text("transport-note", content.transport.note);
  }
  text("itinerary-note", content.itineraryNote);
  applyDays(content.days);
  const stay = content.stay || {};
  text("stay-status", stay.status);
  text("stay-name", stay.name);
  text("stay-body", stay.body);
  text("stay-direction", stay.direction);
  applyTodos(content.todos);
  applyMilestones(content.milestones);
  applyPrayers(content.prayers);
  applyNotes(content.notes, content.emergency);
  text("budget-intro", content.budgetIntro);
  applyBudget(content.budget);
  text("budget-foot", content.budgetFoot);
  text("map-intro", content.mapIntro);
  applyMaps(content.maps);
  text("map-caption", content.mapCaption);
  applyFaqs(content.faqs);
  if (content.footer) applyFooter(content.footer);
}

window.applySiteContent = function () {
  return fetch("/api/content", { cache: "no-store" })
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (data) { if (data && data.content) renderSiteContent(data.content); })
    .catch(function () {});
};
