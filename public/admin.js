const COLORS = [
  ["pink", "粉紅"],
  ["yellow", "黃"],
  ["blue", "藍"],
  ["green", "綠"],
];

let content = null;
let dirty = false;

const loginCard = document.getElementById("login-card");
const editor = document.getElementById("editor");
const sections = document.getElementById("sections");
const saveMsg = document.getElementById("save-msg");
const loginMsg = document.getElementById("login-msg");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function button(label, onClick, className) {
  const node = el("button", className || "pb-btn bg-[var(--yellow)] px-4 py-2 text-sm", label);
  node.type = "button";
  node.addEventListener("click", onClick);
  return node;
}

function fieldInput(value, onChange, options) {
  const opts = options || {};
  const node = document.createElement(opts.rows ? "textarea" : "input");
  node.className = "field";
  if (!opts.rows) node.type = "text";
  if (opts.rows) node.rows = opts.rows;
  if (opts.max) node.maxLength = opts.max;
  if (opts.id) node.id = opts.id;
  node.value = value || "";
  node.addEventListener("input", function () {
    dirty = true;
    onChange(node.value);
  });
  return node;
}

function labeled(text, control) {
  const wrap = el("label", "block mb-3");
  wrap.append(el("span", "block text-sm font-bold mb-1", text), control);
  return wrap;
}

function pair(left, right) {
  const grid = el("div", "grid-2");
  grid.append(left, right);
  return grid;
}

function textField(label, value, onChange, options) {
  return labeled(label, fieldInput(value, onChange, options));
}

function colorField(label, value, onChange) {
  const select = document.createElement("select");
  select.className = "field";
  COLORS.forEach(function (entry) {
    const option = document.createElement("option");
    option.value = entry[0];
    option.textContent = entry[1];
    select.append(option);
  });
  select.value = COLORS.some(function (entry) { return entry[0] === value; }) ? value : "blue";
  select.addEventListener("change", function () {
    dirty = true;
    onChange(select.value);
  });
  return labeled(label, select);
}

function checkField(label, value, onChange) {
  const wrap = el("label", "flex items-center gap-2 font-bold mb-3");
  const box = document.createElement("input");
  box.type = "checkbox";
  box.checked = value === true;
  box.addEventListener("change", function () {
    dirty = true;
    onChange(box.checked);
  });
  wrap.append(box, document.createTextNode(label));
  return wrap;
}

function section(id, title, hint) {
  const card = el("section", "pb-card");
  card.id = id;
  card.append(el("h2", "text-xl font-extrabold mb-1", title));
  if (hint) card.append(el("p", "text-sm mb-4", hint));
  sections.append(card);
  return card;
}

function mountList(host, items, max, createBlank, draw, deleteLabel) {
  host.replaceChildren();
  items.forEach(function (item, index) {
    const card = el("div", "item-card");
    draw(card, item, index);
    card.append(button(deleteLabel || "刪除呢項", function () {
      items.splice(index, 1);
      dirty = true;
      mountList(host, items, max, createBlank, draw, deleteLabel);
    }, "pb-btn mini"));
    host.append(card);
  });
  const add = button(items.length >= max ? "已到上限" : "加一項", function () {
    if (items.length >= max) return;
    items.push(createBlank());
    dirty = true;
    mountList(host, items, max, createBlank, draw);
  }, "pb-btn bg-[var(--green)] px-4 py-2 text-sm");
  add.disabled = items.length >= max;
  host.append(add);
}

function mountStrings(host, items, max, limit, addLabel) {
  host.replaceChildren();
  items.forEach(function (value, index) {
    const row = el("div", "row");
    row.append(fieldInput(value, function (next) { items[index] = next; }, { max: limit }));
    row.append(button("刪除", function () {
      items.splice(index, 1);
      dirty = true;
      mountStrings(host, items, max, limit, addLabel);
    }, "pb-btn mini"));
    host.append(row);
  });
  const add = button(items.length >= max ? "已到上限" : addLabel, function () {
    if (items.length >= max) return;
    items.push("");
    dirty = true;
    mountStrings(host, items, max, limit, addLabel);
  }, "pb-btn bg-[var(--green)] px-4 py-2 text-sm");
  add.disabled = items.length >= max;
  host.append(add);
}

function blankItem() {
  return { tag: "", tagColor: "blue", tag2: "", tag2Color: "yellow", title: "", body: "", focus: false };
}

function blankDay() {
  return { tab: "新一日", color: "blue", title: "行程", items: [blankItem()] };
}

function blankTodo(prefix) {
  const raw = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  return { id: prefix + "-" + raw.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8), label: "" };
}

function drawItem(card, item) {
  card.append(
    pair(
      textField("標籤", item.tag, function (v) { item.tag = v; }, { max: 40 }),
      colorField("標籤顏色", item.tagColor, function (v) { item.tagColor = v; })
    ),
    pair(
      textField("第二標籤", item.tag2, function (v) { item.tag2 = v; }, { max: 40 }),
      colorField("第二標籤顏色", item.tag2Color, function (v) { item.tag2Color = v; })
    ),
    textField("標題", item.title, function (v) { item.title = v; }, { max: 80 }),
    textField("內容", item.body, function (v) { item.body = v; }, { max: 400, rows: 3 }),
    checkField("呢項係重心（粉紅點）", item.focus, function (v) { item.focus = v; })
  );
}

function drawFlight(card, flight, prefix) {
  card.append(
    pair(
      textField("角標", flight.badge, function (v) { flight.badge = v; }, { max: 40, id: prefix + "-badge" }),
      textField("日期", flight.date, function (v) { flight.date = v; }, { max: 40 })
    ),
    pair(
      textField("起飛時間", flight.departTime, function (v) { flight.departTime = v; }, { max: 20 }),
      textField("起飛地點", flight.departPlace, function (v) { flight.departPlace = v; }, { max: 40 })
    ),
    textField("航班", flight.meta, function (v) { flight.meta = v; }, { max: 120, id: prefix + "-meta" }),
    pair(
      textField("抵達時間", flight.arriveTime, function (v) { flight.arriveTime = v; }, { max: 20 }),
      textField("抵達地點", flight.arrivePlace, function (v) { flight.arrivePlace = v; }, { max: 40 })
    ),
    textField("備註", flight.note, function (v) { flight.note = v; }, { max: 400, rows: 3 })
  );
}

function render() {
  const y = window.scrollY;
  sections.replaceChildren();
  const hero = content.hero;
  const about = content.about;
  const transport = content.transport;
  const stay = content.stay;
  const emergency = content.emergency;
  const footer = content.footer;

  const heroCard = section("sec-hero", "首頁", "標題可以換行。起飛時間要係完整時間，例如 2027-03-26T08:00:00+08:00。");
  heroCard.append(
    textField("小標", hero.badge, function (v) { hero.badge = v; }, { max: 40, id: "edit-hero-badge" }),
    textField("標題", hero.title, function (v) { hero.title = v; }, { max: 80, rows: 2 }),
    pair(
      textField("開始日期", hero.dateStart, function (v) { hero.dateStart = v; }, { max: 40 }),
      textField("結束日期", hero.dateEnd, function (v) { hero.dateEnd = v; }, { max: 40 })
    ),
    pair(
      textField("人數一句", hero.summary, function (v) { hero.summary = v; }, { max: 60 }),
      textField("隊長", hero.leader, function (v) { hero.leader = v; }, { max: 60 })
    ),
    textField("倒數說明", hero.countdownNote, function (v) { hero.countdownNote = v; }, { max: 80 }),
    textField("起飛時間", hero.departAt, function (v) { hero.departAt = v; }, { max: 40 }),
    el("p", "text-sm font-bold mb-1", "標籤（最多 6 個）")
  );
  const tags = el("div", "mb-2");
  heroCard.append(tags);
  mountStrings(tags, hero.tags, 6, 30, "加一個標籤");

  const aboutCard = section("sec-about", "點解去");
  aboutCard.append(
    textField("目的", about.purpose, function (v) { about.purpose = v; }, { max: 300, rows: 3 }),
    textField("期望", about.hope, function (v) { about.hope = v; }, { max: 300, rows: 3, id: "edit-about-hope" }),
    textField("金句", about.verse, function (v) { about.verse = v; }, { max: 300, rows: 3 }),
    textField("經文", about.verseRef, function (v) { about.verseRef = v; }, { max: 40 }),
    textField("備註", about.note, function (v) { about.note = v; }, { max: 400, rows: 3 })
  );

  const transportCard = section("sec-transport", "交通", "時間、地點留空的話，儲存後會用返原本航班。網頁唔會估機票價錢。");
  transportCard.append(el("h3", "font-extrabold mb-2", "去程"));
  const outbound = el("div");
  drawFlight(outbound, transport.outbound, "edit-out");
  transportCard.append(outbound, el("h3", "font-extrabold mb-2 mt-2", "回程"));
  const inbound = el("div");
  drawFlight(inbound, transport.inbound, "edit-in");
  transportCard.append(inbound, textField("交通備註", transport.note, function (v) { transport.note = v; }, { max: 400, rows: 3 }));

  const dayCard = section("sec-days", "行程", "最多 4 日，每日最多 8 項。標題同內容都空的項目，儲存後會刪走。");
  dayCard.append(textField("行程說明", content.itineraryNote, function (v) { content.itineraryNote = v; }, { max: 200, rows: 2 }));
  const dayHost = el("div");
  dayCard.append(dayHost);
  mountList(dayHost, content.days, 4, blankDay, function (card, day) {
    card.append(
      pair(
        textField("分頁名", day.tab, function (v) { day.tab = v; }, { max: 30 }),
        colorField("分頁顏色", day.color, function (v) { day.color = v; })
      ),
      textField("當日標題", day.title, function (v) { day.title = v; }, { max: 80 })
    );
    const items = el("div");
    card.append(items);
    if (!Array.isArray(day.items)) day.items = [];
    mountList(items, day.items, 8, blankItem, drawItem);
  }, "刪除呢日");

  const stayCard = section("sec-stay", "住宿");
  stayCard.append(
    textField("狀態", stay.status, function (v) { stay.status = v; }, { max: 40 }),
    textField("名稱", stay.name, function (v) { stay.name = v; }, { max: 80 }),
    textField("說明", stay.body, function (v) { stay.body = v; }, { max: 400, rows: 3 }),
    textField("方向", stay.direction, function (v) { stay.direction = v; }, { max: 300, rows: 2 })
  );

  const todoCard = section("sec-todos", "準備清單", "改字唔會清走隊員已經剔咗的格。刪除再加，已剔的會重設。編號唔使改。");
  todoCard.append(el("h3", "font-extrabold mb-2", "文件"));
  const docs = el("div", "mb-4");
  todoCard.append(docs);
  mountList(docs, content.todos.docs, 20, function () { return blankTodo("doc"); }, function (card, item) {
    card.append(el("p", "hint", "勾選編號：" + item.id));
    card.append(textField("項目", item.label, function (v) { item.label = v; }, { max: 80 }));
  });
  todoCard.append(el("h3", "font-extrabold mb-2", "行李"));
  const bags = el("div");
  todoCard.append(bags);
  mountList(bags, content.todos.bags, 20, function () { return blankTodo("bag"); }, function (card, item) {
    card.append(el("p", "hint", "勾選編號：" + item.id));
    card.append(textField("項目", item.label, function (v) { item.label = v; }, { max: 80 }));
  });

  const mileCard = section("sec-miles", "出發前", "最多 8 項。");
  const miles = el("div");
  mileCard.append(miles);
  mountList(miles, content.milestones, 8, function () {
    return { tag: "", color: "blue", title: "", body: "", focus: false };
  }, function (card, item) {
    card.append(
      pair(
        textField("標籤", item.tag, function (v) { item.tag = v; }, { max: 40 }),
        colorField("顏色", item.color, function (v) { item.color = v; })
      ),
      textField("標題", item.title, function (v) { item.title = v; }, { max: 80 }),
      textField("內容", item.body, function (v) { item.body = v; }, { max: 400, rows: 3 }),
      checkField("重點", item.focus, function (v) { item.focus = v; })
    );
  });

  const prayerCard = section("sec-prayers", "禱告", "最多 12 項。");
  const prayers = el("div");
  prayerCard.append(prayers);
  mountList(prayers, content.prayers, 12, function () {
    return { tag: "", color: "pink", text: "" };
  }, function (card, item) {
    card.append(
      pair(
        textField("標籤", item.tag, function (v) { item.tag = v; }, { max: 20 }),
        colorField("顏色", item.color, function (v) { item.color = v; })
      ),
      textField("內容", item.text, function (v) { item.text = v; }, { max: 300, rows: 3 })
    );
  });

  const noteCard = section("sec-notes", "須知", "連結一定要係 https。最多 12 項。");
  const notes = el("div");
  noteCard.append(notes);
  mountList(notes, content.notes, 12, function () {
    return { title: "", body: "", linkLabel: "", linkUrl: "" };
  }, function (card, item) {
    card.append(
      textField("標題", item.title, function (v) { item.title = v; }, { max: 40 }),
      textField("內容", item.body, function (v) { item.body = v; }, { max: 500, rows: 4 }),
      pair(
        textField("連結文字", item.linkLabel, function (v) { item.linkLabel = v; }, { max: 20 }),
        textField("連結（https）", item.linkUrl, function (v) { item.linkUrl = v; }, { max: 500 })
      )
    );
  });

  const emergencyCard = section("sec-emergency", "緊急電話", "電話只填數字，例如 66448374。");
  emergencyCard.append(
    pair(
      textField("隊長稱呼", emergency.leaderLabel, function (v) { emergency.leaderLabel = v; }, { max: 40 }),
      textField("隊長電話", emergency.leaderPhone, function (v) { emergency.leaderPhone = v; }, { max: 15 })
    ),
    pair(
      textField("教會稱呼", emergency.churchLabel, function (v) { emergency.churchLabel = v; }, { max: 40 }),
      textField("教會電話", emergency.churchPhone, function (v) { emergency.churchPhone = v; }, { max: 15 })
    ),
    textField("教會地址", emergency.churchDetail, function (v) { emergency.churchDetail = v; }, { max: 80 }),
    textField("當地緊急電話", emergency.local, function (v) { emergency.local = v; }, { max: 120, rows: 2 })
  );

  const budgetCard = section("sec-budget", "費用", "呢頁唔估總數。狀態可以寫「待報價」或者「自費」。最多 12 項。");
  budgetCard.append(textField("開場", content.budgetIntro, function (v) { content.budgetIntro = v; }, { max: 300, rows: 3 }));
  const budget = el("div");
  budgetCard.append(budget);
  mountList(budget, content.budget, 12, function () {
    return { name: "", tag: "待報價", color: "yellow" };
  }, function (card, item) {
    card.append(
      textField("項目", item.name, function (v) { item.name = v; }, { max: 60 }),
      pair(
        textField("狀態", item.tag, function (v) { item.tag = v; }, { max: 20 }),
        colorField("顏色", item.color, function (v) { item.color = v; })
      )
    );
  });
  budgetCard.append(textField("頁尾說明", content.budgetFoot, function (v) { content.budgetFoot = v; }, { max: 300, rows: 2 }));

  const mapCard = section("sec-maps", "地圖", "連結一定要係 https。最多 8 個。");
  mapCard.append(textField("開場", content.mapIntro, function (v) { content.mapIntro = v; }, { max: 200, rows: 2 }));
  const maps = el("div");
  mapCard.append(maps);
  mountList(maps, content.maps, 8, function () {
    return { label: "", url: "", color: "yellow" };
  }, function (card, item) {
    card.append(
      textField("名稱", item.label, function (v) { item.label = v; }, { max: 40 }),
      textField("連結（https）", item.url, function (v) { item.url = v; }, { max: 500 }),
      colorField("顏色", item.color, function (v) { item.color = v; })
    );
  });
  mapCard.append(textField("地圖說明", content.mapCaption, function (v) { content.mapCaption = v; }, { max: 80 }));

  const faqCard = section("sec-faqs", "常見問題", "問題同答案都要有，先會顯示。最多 12 條。");
  const faqs = el("div");
  faqCard.append(faqs);
  mountList(faqs, content.faqs, 12, function () {
    return { q: "", a: "" };
  }, function (card, item) {
    card.append(
      textField("問題", item.q, function (v) { item.q = v; }, { max: 80 }),
      textField("答案", item.a, function (v) { item.a = v; }, { max: 400, rows: 3 })
    );
  });

  const footerCard = section("sec-footer", "頁尾", "電話只填數字。");
  footerCard.append(
    textField("第一行", footer.line1, function (v) { footer.line1 = v; }, { max: 80 }),
    pair(
      textField("隊長稱呼", footer.leaderLabel, function (v) { footer.leaderLabel = v; }, { max: 40 }),
      textField("隊長電話", footer.leaderPhone, function (v) { footer.leaderPhone = v; }, { max: 15 })
    ),
    textField("第三行", footer.line3, function (v) { footer.line3 = v; }, { max: 120, rows: 2 })
  );

  window.scrollTo(0, y);
}

function formatTime(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-HK", {
    timeZone: "Asia/Hong_Kong",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function setMsg(node, text, isError) {
  node.textContent = text || "";
  node.classList.toggle("error", Boolean(isError));
}

async function loadHopes() {
  const host = document.getElementById("hope-list");
  host.replaceChildren(el("p", "text-sm", "載入中…"));
  const response = await fetch("/api/admin/expectations", { cache: "no-store" });
  const data = await readJson(response);
  host.replaceChildren();
  if (!response.ok) {
    host.append(el("p", "msg error", data.error || "載入唔到期望"));
    return;
  }
  const rows = data.expectations || [];
  if (!rows.length) {
    host.append(el("p", "text-sm", "暫時未有期望。"));
    return;
  }
  rows.forEach(function (row) {
    const card = el("div", "item-card");
    card.append(el("p", "font-extrabold", row.name));
    card.append(el("p", "text-sm pre", row.body));
    card.append(el("p", "hint", formatTime(row.created_at)));
    card.append(button("刪除呢句", async function () {
      if (!window.confirm("刪除「" + row.name + "」呢句期望？")) return;
      const deleted = await fetch("/api/admin/expectations/" + row.id, { method: "DELETE" });
      const payload = await readJson(deleted);
      if (!deleted.ok) {
        setMsg(saveMsg, payload.error || "刪除失敗", true);
        return;
      }
      await loadHopes();
    }, "pb-btn bg-[var(--pink)] px-3 py-1 text-sm"));
    host.append(card);
  });
}

async function showEditor() {
  loginCard.hidden = true;
  editor.hidden = false;
  setMsg(saveMsg, "載入中…", false);
  const response = await fetch("/api/content", { cache: "no-store" });
  const data = await readJson(response);
  if (!response.ok || !data.content) {
    setMsg(saveMsg, "載入唔到內容", true);
    return;
  }
  content = data.content;
  dirty = false;
  render();
  setMsg(saveMsg, data.updatedAt ? "上次儲存：" + formatTime(data.updatedAt) : "未改過，而家顯示原本文字。", false);
  await loadHopes();
}

async function saveContent(reset) {
  const saveBtn = document.getElementById("save-btn");
  saveBtn.disabled = true;
  setMsg(saveMsg, reset ? "還原中…" : "儲存中…", false);
  try {
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(reset ? { reset: true } : { content: content }),
    });
    const data = await readJson(response);
    if (!response.ok) {
      setMsg(saveMsg, data.error || "儲存失敗", true);
      return;
    }
    content = data.content;
    dirty = false;
    render();
    setMsg(saveMsg, reset ? "已還原預設。" : "已儲存。公開頁已更新。", false);
  } catch {
    setMsg(saveMsg, "連不上伺服器，請再試一次", true);
  } finally {
    saveBtn.disabled = false;
  }
}

document.getElementById("login-form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const buttonNode = document.getElementById("login-btn");
  const password = document.getElementById("password");
  buttonNode.disabled = true;
  setMsg(loginMsg, "", false);
  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: password.value }),
    });
    const data = await readJson(response);
    if (!response.ok) {
      setMsg(loginMsg, data.error || "入唔到", true);
      return;
    }
    password.value = "";
    await showEditor();
  } catch {
    setMsg(loginMsg, "連不上伺服器，請再試一次", true);
  } finally {
    buttonNode.disabled = false;
  }
});

document.getElementById("save-btn").addEventListener("click", function () {
  saveContent(false);
});

document.getElementById("reset-btn").addEventListener("click", function () {
  if (!window.confirm("還原成原本頁面文字？你未儲存的改動會冇咗。")) return;
  saveContent(true);
});

document.getElementById("logout-btn").addEventListener("click", async function () {
  await fetch("/api/admin/logout", { method: "POST" });
  content = null;
  dirty = false;
  editor.hidden = true;
  loginCard.hidden = false;
  setMsg(loginMsg, "已登出。", false);
});

window.addEventListener("beforeunload", function (event) {
  if (!dirty) return;
  event.preventDefault();
  event.returnValue = "";
});

fetch("/api/admin/session", { cache: "no-store" })
  .then(readJson)
  .then(function (data) {
    if (data.ok) return showEditor();
    loginCard.hidden = false;
  })
  .catch(function () {
    loginCard.hidden = false;
    setMsg(loginMsg, "連不上伺服器，請再試一次", true);
  });
