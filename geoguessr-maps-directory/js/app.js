import { maps } from "./map.js";
const mapList = document.getElementById("mapsList");
const searchInput = document.getElementById("searchInput");
const minLocations = document.getElementById("minLocations");
const categoryFilter = document.getElementById("categoryFilter");
const emptyState = document.getElementById("emptyState");

const mapCount = document.getElementById("mapCount");
const totalLocations = document.getElementById("totalLocations");
const totalLikes = document.getElementById("totalLikes");
const totalPlays = document.getElementById("totalPlays");

// แสดงรายการ Maps
function renderMaps(data) {
  if (!mapList) {
    console.error('ไม่พบ <tbody id="mapsList"> ใน index.html');
    return;
  }

  mapList.replaceChildren();

  data.forEach((map) => {
    const tr = document.createElement("tr");

    // คอลัมน์ชื่อ Map
    const nameTd = document.createElement("td");
    const nameBox = document.createElement("div");
    nameBox.className = "map-name";

    const icon = document.createElement("span");
    icon.className = "map-icon";
    icon.textContent = "◕";

    const link = document.createElement("a");
    link.textContent = map.name;
    link.href = map.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.color = "inherit";
    link.style.textDecoration = "none";

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

    return (
      matchesSearch &&
      matchesLocations &&
      matchesCategory
    );
  });

  renderMaps(filteredMaps);
}

// ค้นหาทันทีเมื่อพิมพ์
searchInput.addEventListener("input", filterMaps);

// กรองเมื่อเปลี่ยนตัวเลือก
minLocations.addEventListener("change", filterMaps);
categoryFilter.addEventListener("change", filterMaps);

// แสดง Maps ทั้งหมดเมื่อเปิดหน้า
if (typeof maps !== "undefined" && Array.isArray(maps)) {
  filterMaps();
} else {
  console.error("ไม่พบตัวแปร maps จาก js/map.js");
}
