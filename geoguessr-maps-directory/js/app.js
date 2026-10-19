import { maps } from "./map.js";
const mapList = document.getElementById("mapsList");
const searchInput = document.getElementById("searchInput");
const minLocations = document.getElementById("minLocations");
const categoryFilter = document.getElementById("categoryFilter");
const sectionFilter = document.getElementById("sectionFilter");
const emptyState = document.getElementById("emptyState");
const continentFilter = document.getElementById("continentFilter");
const countryFilter = document.getElementById("countryFilter");

const mapCount = document.getElementById("mapCount");
const totalLocations = document.getElementById("totalLocations");
const totalLikes = document.getElementById("totalLikes");
const totalPlays = document.getElementById("totalPlays");

const INITIAL_MAP_LIMIT = 50;

function populateFilterOptions() {
  const continents = [...new Set(
    maps
      .map(map => map.continent)
      .filter(value => value && value !== "-")
  )].sort();

  const categories = [...new Set(
    maps
      .map(map => map.category?.trim())
      .filter(value => value && value !== "-")
  )].sort((a, b) => a.localeCompare(b));

  categoryFilter.replaceChildren(new Option("Any", "Any"));

  categories.forEach(category => {
    categoryFilter.add(new Option(category, category));
  });

  const sections = [...new Set(
    maps
      .map(map => map.section?.trim())
      .filter(value => value && value !== "-")
  )].sort((a, b) => a.localeCompare(b));

  continentFilter.replaceChildren(new Option("Any", "Any"));
  countryFilter.replaceChildren(new Option("Any", "Any"));

  continents.forEach(continent => {
    continentFilter.add(new Option(continent, continent));
  });

  if (sectionFilter) {
    sectionFilter.replaceChildren(new Option("Any", "Any"));

    sections.forEach(section => {
      sectionFilter.add(new Option(section, section));
    });
  }

  updateDependentFilters();
}

function updateDependentFilters() {
  const min = Number(minLocations.value) || 0;
  const category = categoryFilter.value;
  const selectedContinent = continentFilter.value;
  const previousCountry = countryFilter.value;

  // World: ล็อก CONTINENT และ COUNTRY
  if (category === "World") {
    continentFilter.value = "Any";
    countryFilter.value = "Any";
    continentFilter.disabled = true;
    countryFilter.disabled = true;
    return;
  }

  // Continent: เลือกทวีปได้ แต่เลือกประเทศไม่ได้
  continentFilter.disabled = false;

  if (category === "Continent") {
    countryFilter.replaceChildren(new Option("Any", "Any"));
    countryFilter.disabled = true;
    return;
  }

  // Any หรือ Country: สร้างรายชื่อประเทศใหม่
  countryFilter.disabled = false;

  const countries = [...new Set(
    maps
      .filter(map =>
        map.country &&
        map.country !== "-" &&
        (
          selectedContinent === "Any" ||
          map.continent === selectedContinent
        )
      )
      .map(map => map.country)
  )].sort();

  countryFilter.replaceChildren(new Option("Any", "Any"));

  countries.forEach(country => {
    countryFilter.add(new Option(country, country));
  });

  // คงประเทศที่เลือกไว้ถ้ายังตรงกับทวีป
  countryFilter.value = countries.includes(previousCountry)
    ? previousCountry
    : "Any";
}


// แสดงรายการ Maps
function renderMaps(data) {
  if (!mapList) {
    console.error('ไม่พบ <tbody id="mapsList"> ใน index.html');
    return;
  }

  mapList.replaceChildren();

  data.slice(0, INITIAL_MAP_LIMIT).forEach((map) => {
    const tr = document.createElement("tr");

    // คอลัมน์ชื่อ Map
    const nameTd = document.createElement("td");
    const nameBox = document.createElement("div");
    nameBox.className = "map-name";

    const icon = document.createElement("span");
    icon.className = map.isExternalCreator
      ? "map-icon external-map-icon"
      : "map-icon";
    icon.textContent = "◕";

    const link = document.createElement("a");
    link.textContent = map.name;
    link.href = map.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const isSpecialMap = [
      "SlashP’s Maps",
      "John Harvey Kellogg’s Maps"
    ].includes(map.name);

    link.className = isSpecialMap
      ? "map-link special-map-link"
      : "map-link";

    nameBox.append(icon, link);
    nameTd.append(nameBox);
    tr.append(nameTd);

    // คอลัมน์ข้อมูลอื่น ๆ
    const values = [
      map.locations,
      map.category,
      map.section,
      map.continent,
      map.country,
    ];

    values.forEach((value, index) => {
      const td = document.createElement("td");

      if (index === 0) {
        td.className = "numeric";
      }

      if (index === 1 && value) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = value;
        td.append(tag);
      } else {
        td.textContent =
          typeof value === "number"
            ? value.toLocaleString("en-US")
            : value || "—";
      }

      tr.append(td);
    });

    mapList.append(tr);
  });

  // สถานะเมื่อไม่มีผลลัพธ์
  if (emptyState) {
    emptyState.hidden = data.length !== 0;
  }

  // อัปเดตจำนวนและยอดรวมตามผลการค้นหา
  if (mapCount) {
    mapCount.textContent = `${data.length} maps`;
  }

  if (totalLocations) {
    totalLocations.textContent = data
      .reduce((sum, map) => sum + (Number(map.locations) || 0), 0)
      .toLocaleString("en-US");
  }

  if (totalLikes) {
    totalLikes.textContent = data
      .reduce((sum, map) => sum + (Number(map.likes) || 0), 0)
      .toLocaleString("en-US");
  }

  if (totalPlays) {
    totalPlays.textContent = data
      .reduce((sum, map) => sum + (Number(map.plays) || 0), 0)
      .toLocaleString("en-US");
  }
}

// กรอง Maps ตาม Search และ Filters
function filterMaps() {
  const keyword = searchInput.value.trim().toLowerCase();
  const min = Number(minLocations.value) || 0;
  const category = categoryFilter.value;
  const section = sectionFilter?.value || "Any";
  const continent = continentFilter.value;
  const country = countryFilter.value;


  const filteredMaps = maps.filter((map) => {
    // ค้นหาจากชื่อ, URL, code และข้อมูลทุกคอลัมน์
    const searchableText = [
      map.name,
      map.url,
      map.code,
      map.category,
      map.section,
      map.continent,
      map.country,
    ]
      .filter((value) => value != null)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(keyword);

    const matchesLocations =
      (Number(map.locations) || 0) >= min;

    const matchesCategory =
      category === "Any" || map.category === category;

    const matchesSection =
      section === "Any" || map.section?.trim() === section;

    const matchesContinent =
      continent === "Any" || map.continent === continent;

    const matchesCountry =
      country === "Any" || map.country === country;

    return (
      matchesSearch &&
      matchesLocations &&
      matchesCategory &&
      matchesSection &&
      matchesContinent &&
      matchesCountry
    );
  });

   // เรียง Category: World ขึ้นก่อน Country
  
const categoryOrder = [
  "World",
  "Country",
  "Continent",
  "Group of countries",
  "Two countries",
  "Subdivision lv.1",
  "Area code zone",
  "High-Volume Map Creator"
];

const availableCategories = new Set(
  maps
    .map(map => map.category?.trim())
    .filter(Boolean)
);

const categories = [
  ...categoryOrder.filter(category => availableCategories.has(category)),
  ...[...availableCategories]
    .filter(category => !categoryOrder.includes(category))
    .sort((a, b) => a.localeCompare(b))
];

categoryFilter.replaceChildren(new Option("Any", "Any"));

categories.forEach(category => {
  categoryFilter.add(new Option(category, category));
});

  // เรียงลำดับ:
  // 1. High-Volume Map Creator
  // 2. World
  // 3. Category อื่น ๆ
  filteredMaps.sort((a, b) => {
    const isHighVolumeA =
      a.category === "High-Volume Map Creator";
    const isHighVolumeB =
      b.category === "High-Volume Map Creator";

    // High-Volume Map Creator ขึ้นก่อนเสมอ
    if (isHighVolumeA && !isHighVolumeB) return -1;
    if (!isHighVolumeA && isHighVolumeB) return 1;

    const categoryA = (a.category || "").trim().toLowerCase();
    const categoryB = (b.category || "").trim().toLowerCase();

    // World ขึ้นก่อน Category อื่น
    if (categoryA === "world" && categoryB !== "world") return -1;
    if (categoryA !== "world" && categoryB === "world") return 1;

    return 0;
  });

  renderMaps(filteredMaps);
}

searchInput.addEventListener("input", filterMaps);
minLocations.addEventListener("change", filterMaps);

sectionFilter?.addEventListener("change", filterMaps);

categoryFilter.addEventListener("change", () => {
  updateDependentFilters();
  filterMaps();
});

continentFilter.addEventListener("change", () => {
  updateDependentFilters();
  filterMaps();
});

countryFilter.addEventListener("change", filterMaps);

if (Array.isArray(maps)) {
  populateFilterOptions();
  filterMaps();
} else {
  console.error("ไม่พบตัวแปร maps จาก js/map.js");
}