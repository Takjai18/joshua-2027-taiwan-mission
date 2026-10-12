export const COLORS = ["pink", "yellow", "blue", "green"];

export const DEFAULT_CONTENT = {
  hero: {
    badge: "3月28日 · 復活節主日",
    title: "約書亞團2027\n台灣屏東短宣之旅",
    dateStart: "2027年3月26日（五）",
    dateEnd: "至 3月29日（一）",
    summary: "4日3夜 · 預計 11 人",
    leader: "隊長：邱明德（德仔）",
    tags: ["宣道會基蔭堂", "中華福音使命團", "台灣 · 屏東恆春"],
    countdownNote: "2027年3月26日 08:00 香港時間起飛",
    departAt: "2027-03-26T08:00:00+08:00",
  },
  about: {
    purpose: "讓一眾青少年體驗海外宣教，同時讓他們認識台灣的教會。",
    hope: "參加者能在過程中經歷上主，被主使用，同時能開眼界。",
    verse: "「你當剛強壯膽！不要懼怕，也不要驚惶；因為你無論往哪裡去，耶和華你的神必與你同在。」",
    verseRef: "約書亞記 1:9",
    note: "工場日程由中華福音使命團同當地負責人最後編排。下面的航班、住宿同每日流程係隊伍籌備方向，確認後會更新這頁。",
  },
  transport: {
    outbound: {
      badge: "去程 · 暫定",
      date: "3/26（五）",
      departTime: "08:00",
      departPlace: "HKG 香港",
      meta: "HK Express UO130 · 預計飛行約 1 小時 30 分",
      arriveTime: "09:30",
      arrivePlace: "KHH 高雄小港",
      note: "落地後過關、取行李，轉乘墾丁快線（9189）往恆春轉運站，車程約 2.5 小時。班次視當天過關時間而定。",
    },
    inbound: {
      badge: "回程 · 暫定",
      date: "3/29（一）",
      departTime: "16:45",
      departPlace: "KHH 高雄小港",
      meta: "國泰 CX433",
      arriveTime: "18:20",
      arrivePlace: "HKG 香港",
      note: "由恆春轉運站乘快線回高雄。16:45 起飛，要預留國際線報到同安檢，上午就要動身。",
    },
    note: "集合地點同時間，出發前在隊伍群組公布。機票未出之前，以上航班只係籌備用。",
  },
  itineraryNote: "粉紅點係這日的重心。時間仍可因工場安排改動。",
  days: [
    {
      tab: "3/26（五）",
      color: "pink",
      title: "3/26 抵達與安頓",
      items: [
        { tag: "08:00 – 09:30", tagColor: "blue", tag2: "", tag2Color: "yellow", title: "香港飛高雄", body: "小港機場出境大堂集合、點名。護照同入台證放在伸手可及的地方。", focus: false },
        { tag: "上午至午間", tagColor: "yellow", tag2: "", tag2Color: "yellow", title: "墾丁快線往恆春", body: "車上可以小休，沿途是南台灣的田同海。", focus: false },
        { tag: "重心", tagColor: "pink", tag2: "下午", tag2Color: "green", title: "民宿 Check-in 與開幕禱告", body: "放低行李，短宣隊一齊禱告，聽工場負責人講這幾日點行。", focus: true },
        { tag: "傍晚", tagColor: "blue", tag2: "", tag2Color: "yellow", title: "恆春老街", body: "晚餐自理。可以試試綠豆蒜、洋蔥料理同其他在地小食。", focus: false },
      ],
    },
    {
      tab: "3/27（六）",
      color: "yellow",
      title: "3/27 服事與交流",
      items: [
        { tag: "早上", tagColor: "yellow", tag2: "", tag2Color: "yellow", title: "晨更與早餐", body: "先安靜，再出門。", focus: false },
        { tag: "重心", tagColor: "pink", tag2: "上午", tag2Color: "green", title: "南灣淨灘", body: "用行動愛護上帝的創造。要搽防曬、戴帽、帶水。穿可以濕、可以污糟的鞋。", focus: true },
        { tag: "下午", tagColor: "blue", tag2: "", tag2Color: "yellow", title: "當地教會青年交流", body: "見證分享、破冰遊戲。我們是去認識人，不是去表演一場就走。", focus: false },
        { tag: "晚上", tagColor: "pink", tag2: "", tag2Color: "yellow", title: "晚堂與當天分享", body: "講今日看見的人、自己的感受，以及明日要交託的事。", focus: false },
      ],
    },
    {
      tab: "3/28（日）復活",
      color: "blue",
      title: "3/28 復活節主日",
      items: [
        { tag: "復活節", tagColor: "pink", tag2: "上午", tag2Color: "yellow", title: "恆春教會主日崇拜", body: "這日是復活節。一齊敬拜、獻詩，認識在地的弟兄姊妹。", focus: true },
        { tag: "中午", tagColor: "green", tag2: "", tag2Color: "yellow", title: "愛宴", body: "與教會飯桌相交。食飯的時候，往往是最真實的認識。", focus: false },
        { tag: "下午", tagColor: "blue", tag2: "", tag2Color: "yellow", title: "鵝鑾鼻燈塔", body: "台灣最南端。看看海，也想想燈是為誰而亮。", focus: false },
        { tag: "晚上", tagColor: "pink", tag2: "", tag2Color: "yellow", title: "感恩晚會", body: "數算這幾日的恩典，也為恆春的教會禱告。", focus: false },
      ],
    },
    {
      tab: "3/29（一）",
      color: "green",
      title: "3/29 賦歸",
      items: [
        { tag: "早上", tagColor: "green", tag2: "", tag2Color: "yellow", title: "退房、伴手禮", body: "最後機會買恆春小食。行李今晚要托運，液體同重量自己看清楚。", focus: false },
        { tag: "要準時", tagColor: "pink", tag2: "午前", tag2Color: "yellow", title: "快線返回高雄小港", body: "車程約兩個多小時，再加上報到。不要把回程當成還有半日自由活動。", focus: true },
        { tag: "16:45", tagColor: "blue", tag2: "", tag2Color: "yellow", title: "飛返香港", body: "預計 18:20 抵港。回家之後，把這次看見的跟身邊的人說。", focus: false },
      ],
    },
  ],
  stay: {
    status: "待工場確認",
    name: "恆春鎮內或附近",
    body: "名稱、地址、電話同入住房間，確認後會寫上這頁，也會貼到群組。",
    direction: "方向是方便步行或短途去到聚會同老街，避免每日長途接送。",
  },
  todos: {
    docs: [
      { id: "permit", label: "辦好入台證，並自行存好" },
      { id: "passport", label: "護照有效期涵蓋全程，並多過六個月" },
      { id: "insurance", label: "旅遊保險，須包括 24 小時緊急支援" },
      { id: "health", label: "交健康狀況同緊急聯絡人給隊長" },
      { id: "consent", label: "未滿 18 歲：家長同意書" },
      { id: "training", label: "出席出發前短宣集訓" },
      { id: "testimony", label: "準備一個短見證，三分鐘內講完" },
    ],
    bags: [
      { id: "medicine", label: "常用藥放在原裝盒，隨手提行李" },
      { id: "sun", label: "防曬、帽、水樽、可濕的鞋" },
      { id: "plug", label: "轉接插頭。台灣是 110V、扁腳" },
      { id: "cash", label: "新台幣現金、行動電源" },
      { id: "bible", label: "聖經同筆記" },
    ],
  },
  milestones: [
    { tag: "已完成", color: "green", title: "2026年10月7日 · 申請已交", body: "宣道會基蔭堂向中華福音使命團申請這次台灣短宣。教牧是麥志江牧師，領隊是邱明德。", focus: true },
    { tag: "2027年1月26日前", color: "yellow", title: "截止報名，交齊隊員資料", body: "使命團以出發前兩個月為限。資料交齊，工場才編得到日程。", focus: false },
    { tag: "日期待通知", color: "blue", title: "短宣集訓", body: "每一位隊員都要出席中華福音使命團出發前的集訓。", focus: false },
    { tag: "2027年3月26日", color: "pink", title: "由香港出發", body: "4日3夜。3月28日是復活節主日，3月29日返港。", focus: true },
  ],
  prayers: [
    { tag: "隊員的心", color: "pink", text: "求主預備這 11 位青少年，敢於被使用，也肯被在地的弟兄姊妹教導。" },
    { tag: "工場安排", color: "yellow", text: "為中華福音使命團同恆春的接待教會禱告。住宿、交通、聚會對象，都在上帝手裡。" },
    { tag: "復活節主日", color: "blue", text: "3月28日一齊敬拜的時候，求主讓兩邊的教會都遇見復活的主，而不只是完成一個行程。" },
    { tag: "身體與安全", color: "green", text: "飛行、長途車、淨灘、飲食。求主保守沒有人掉隊，也沒有人硬撐。" },
    { tag: "回來之後", color: "pink", text: "求主讓這次看見的，變成回到基蔭堂之後仍然在意的人。" },
  ],
  notes: [
    { title: "證件", body: "香港居民去台灣要辦入台證，不是只帶回鄉證或身份證。香港出生、停留不多於 30 日，多數可以辦免費網簽；不是香港出生，或第一次去台灣，可能要走雲端申請，要預早數星期。自己到內政部移民署網站按最新規定辦理，並存好證明。", linkLabel: "移民署", linkUrl: "https://www.immigration.gov.tw/" },
    { title: "保險", body: "使命團要求旅遊保險包括 24 小時緊急支援。出發前把保單資料交一份給隊長。隊長保管一份，教會再存一份，應急用。", linkLabel: "", linkUrl: "" },
    { title: "誰可以去", body: "這次是青少年短宣，預計 11 人，上限跟工場安排。使命團的一般規定是 8 至 70 歲，行動自如；8 至 14 歲要有父親或母親同行。15 至 17 歲要有家長書面同意。", linkLabel: "", linkUrl: "" },
    { title: "天氣同裝備", body: "3 月底恆春大致溫暖，日間可以是短袖，早晚加一件薄外套。要備防曬、帽同薄雨衣。淨灘當日穿可以弄污的衣服。", linkLabel: "", linkUrl: "" },
    { title: "電、錢、上網", body: "台灣電壓 110V，插座是扁腳（A 型）。手機充電器多數 100–240V 都可用，風筒這類大電器先看標籤。夜市同小店多用現金，預先換一些新台幣。上網可以用漫遊或落地再買卡，出發前在群組講定。", linkLabel: "", linkUrl: "" },
    { title: "在工場的時候", body: "跟工場負責人的指示生活同工作。個人貴重物品自己看管。有不適要即時跟隊長說，不要自己硬撐。", linkLabel: "", linkUrl: "" },
  ],
  emergency: {
    leaderLabel: "隊長邱明德（德仔）",
    leaderPhone: "66448374",
    churchLabel: "基蔭堂辦事處",
    churchPhone: "24926502",
    churchDetail: "荃灣新領域廣場 11 樓 1113 室",
    local: "在台灣：報案 110，救護同消防 119。",
  },
  budgetIntro: "總數未有工場報價，這頁不估一個假數字。下面是這次會出現的項目，確認後補上每人應付金額。",
  budget: [
    { name: "來回機票 HKG ↔ KHH", tag: "待報價", color: "yellow" },
    { name: "當地住宿（3 晚）", tag: "待報價", color: "yellow" },
    { name: "當地交通", tag: "待報價", color: "yellow" },
    { name: "部分餐費", tag: "待報價", color: "yellow" },
    { name: "旅遊保險", tag: "自費", color: "blue" },
    { name: "入台證（如適用）", tag: "自費", color: "blue" },
    { name: "個人零用、伴手禮", tag: "自費", color: "blue" },
  ],
  budgetFoot: "若使命團指定閱讀或工場聚會要用的道具，隊長會另行列出，不會臨時在機場先說。",
  mapIntro: "住宿地址未定。下面先放這次會經過的地方，方便你自己認路。",
  maps: [
    { label: "📍 恆春鎮", url: "https://www.google.com/maps/search/?api=1&query=%E6%81%86%E6%98%A5%E9%8E%AE", color: "yellow" },
    { label: "🏖 南灣", url: "https://www.google.com/maps/search/?api=1&query=%E5%8D%97%E7%81%A3%E6%81%86%E6%98%A5", color: "blue" },
    { label: "🗼 鵝鑾鼻燈塔", url: "https://www.google.com/maps/search/?api=1&query=%E9%B5%9D%E9%91%BE%E9%BC%BB%E7%87%88%E5%A1%94", color: "pink" },
    { label: "✈️ 高雄小港機場", url: "https://www.google.com/maps/search/?api=1&query=%E9%AB%98%E9%9B%84%E5%9C%8B%E9%9A%9B%E6%A9%9F%E5%A0%B4", color: "green" },
  ],
  mapCaption: "恆春鎮一帶（OpenStreetMap）",
  faqs: [
    { q: "住宿什麼時候有地址？", a: "工場確認後才有。有了會改這頁，也會在群組說。" },
    { q: "航班是不是已經訂了？", a: "未當已訂。頁上的 UO130 同 CX433 是籌備方向，以最後機票為準。" },
    { q: "要不要參加集訓？", a: "要。中華福音使命團出發前的集訓，隊員都要出席。日期確定後通知。" },
    { q: "餐費怎樣算？", a: "愛宴同部分團隊用餐由行程包，其餘自理。恆春老街選擇多，自己帶少量現金。" },
    { q: "我未滿 18 歲，可以去嗎？", a: "可以先問隊長。15 至 17 歲要家長書面同意。8 至 14 歲按使命團規定要有父或母同行。這次隊伍以青少年為主。" },
    { q: "有問題找誰？", a: "找隊長德仔 6644 8374。不要把問題只留在心裡直到機場。" },
  ],
  footer: {
    line1: "宣道會基蔭堂約書亞團 · 2027 台灣屏東短宣",
    leaderLabel: "隊長邱明德",
    leaderPhone: "66448374",
    line3: "與中華福音使命團同行。日程以工場最後通知為準。",
  },
};

function clip(value, max, newlines) {
  if (typeof value !== "string") return "";
  let text = value.replace(/[<>]/g, "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
  if (newlines) text = text.replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  else text = text.replace(/\s+/g, " ");
  return text.trim().slice(0, max);
}

function color(value) {
  return COLORS.includes(value) ? value : "blue";
}

function httpsUrl(value) {
  if (typeof value !== "string" || value.trim() === "") return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return "";
    return url.toString().slice(0, 500);
  } catch {
    return "";
  }
}

function phone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 15);
  return digits.length >= 4 ? digits : "";
}

function departAt(value) {
  if (typeof value !== "string") return DEFAULT_CONTENT.hero.departAt;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return DEFAULT_CONTENT.hero.departAt;
  return value.slice(0, 40);
}

function item(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    tag: clip(source.tag, 40),
    tagColor: color(source.tagColor),
    tag2: clip(source.tag2, 40),
    tag2Color: color(source.tag2Color),
    title: clip(source.title, 80),
    body: clip(source.body, 400),
    focus: source.focus === true,
  };
}

function list(value, max, map) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, max).map(map).filter(Boolean);
}

export function sanitizeContent(input) {
  const source = input && typeof input === "object" ? input : {};
  const hero = source.hero || {};
  const about = source.about || {};
  const transport = source.transport || {};
  const stay = source.stay || {};
  const emergency = source.emergency || {};
  const footer = source.footer || {};
  const todos = source.todos || {};
  const flight = (value, fallback) => {
    const row = value && typeof value === "object" ? value : {};
    return {
      badge: clip(row.badge, 40) || fallback.badge,
      date: clip(row.date, 40) || fallback.date,
      departTime: clip(row.departTime, 20) || fallback.departTime,
      departPlace: clip(row.departPlace, 40) || fallback.departPlace,
      meta: clip(row.meta, 120),
      arriveTime: clip(row.arriveTime, 20) || fallback.arriveTime,
      arrivePlace: clip(row.arrivePlace, 40) || fallback.arrivePlace,
      note: clip(row.note, 400),
    };
  };
  const todo = (value, prefix) => list(value, 20, (row, index) => {
    const label = clip(row?.label, 80);
    if (!label) return null;
    const id = clip(row?.id, 40).replace(/[^\w-]/g, "") || prefix + "-" + (index + 1);
    return { id, label };
  });
  let days = list(source.days, 4, (day) => {
    const items = list(day?.items, 8, item).filter((row) => row.title || row.body);
    if (!items.length) return null;
    return {
      tab: clip(day?.tab, 30) || "一日",
      color: color(day?.color),
      title: clip(day?.title, 80) || "行程",
      items,
    };
  });
  if (!days.length) days = DEFAULT_CONTENT.days;

  return {
    hero: {
      badge: clip(hero.badge, 40),
      title: clip(hero.title, 80, true) || DEFAULT_CONTENT.hero.title,
      dateStart: clip(hero.dateStart, 40),
      dateEnd: clip(hero.dateEnd, 40),
      summary: clip(hero.summary, 60),
      leader: clip(hero.leader, 60),
      tags: list(hero.tags, 6, (tag) => clip(tag, 30)).filter(Boolean),
      countdownNote: clip(hero.countdownNote, 80),
      departAt: departAt(hero.departAt),
    },
    about: {
      purpose: clip(about.purpose, 300),
      hope: clip(about.hope, 300),
      verse: clip(about.verse, 300),
      verseRef: clip(about.verseRef, 40),
      note: clip(about.note, 400),
    },
    transport: {
      outbound: flight(transport.outbound, DEFAULT_CONTENT.transport.outbound),
      inbound: flight(transport.inbound, DEFAULT_CONTENT.transport.inbound),
      note: clip(transport.note, 400),
    },
    itineraryNote: clip(source.itineraryNote, 200),
    days,
    stay: {
      status: clip(stay.status, 40),
      name: clip(stay.name, 80),
      body: clip(stay.body, 400),
      direction: clip(stay.direction, 300),
    },
    todos: {
      docs: todo(todos.docs, "doc"),
      bags: todo(todos.bags, "bag"),
    },
    milestones: list(source.milestones, 8, (row) => {
      const title = clip(row?.title, 80);
      const body = clip(row?.body, 400);
      if (!title && !body) return null;
      return { tag: clip(row?.tag, 40), color: color(row?.color), title, body, focus: row?.focus === true };
    }),
    prayers: list(source.prayers, 12, (row) => {
      const text = clip(row?.text, 300);
      if (!text) return null;
      return { tag: clip(row?.tag, 20), color: color(row?.color), text };
    }),
    notes: list(source.notes, 12, (row) => {
      const title = clip(row?.title, 40);
      const body = clip(row?.body, 500);
      if (!title && !body) return null;
      return { title, body, linkLabel: clip(row?.linkLabel, 20), linkUrl: httpsUrl(row?.linkUrl) };
    }),
    emergency: {
      leaderLabel: clip(emergency.leaderLabel, 40),
      leaderPhone: phone(emergency.leaderPhone),
      churchLabel: clip(emergency.churchLabel, 40),
      churchPhone: phone(emergency.churchPhone),
      churchDetail: clip(emergency.churchDetail, 80),
      local: clip(emergency.local, 120),
    },
    budgetIntro: clip(source.budgetIntro, 300),
    budget: list(source.budget, 12, (row) => {
      const name = clip(row?.name, 60);
      if (!name) return null;
      return { name, tag: clip(row?.tag, 20), color: color(row?.color) };
    }),
    budgetFoot: clip(source.budgetFoot, 300),
    mapIntro: clip(source.mapIntro, 200),
    maps: list(source.maps, 8, (row) => {
      const url = httpsUrl(row?.url);
      const label = clip(row?.label, 40);
      if (!url || !label) return null;
      return { label, url, color: color(row?.color) };
    }),
    mapCaption: clip(source.mapCaption, 80),
    faqs: list(source.faqs, 12, (row) => {
      const q = clip(row?.q, 80);
      const a = clip(row?.a, 400);
      if (!q || !a) return null;
      return { q, a };
    }),
    footer: {
      line1: clip(footer.line1, 80),
      leaderLabel: clip(footer.leaderLabel, 40),
      leaderPhone: phone(footer.leaderPhone),
      line3: clip(footer.line3, 120),
    },
  };
}
