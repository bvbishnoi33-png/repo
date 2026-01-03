import { collection, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const grid = document.getElementById("contentGrid");

const q = query(collection(db, "content"), orderBy("order"));
const snapshot = await getDocs(q);

snapshot.forEach(docu => {
  const d = docu.data();
  grid.innerHTML += `
    <div class="card">
      ${d.imageUrl ? `<img src="${d.imageUrl}">` : ""}
      <h3>${d.title}</h3>
      <p>${d.description}</p>
      ${d.fileUrl ? `<a href="${d.fileUrl}" target="_blank"><button>Open</button></a>` : ""}
    </div>`;
});

// ================== CATEGORY LOADER ==================
window.loadContent = async function (category) {
  const q = query(collection(db, "content"), orderBy("order"));
  const snapshot = await getDocs(q);

  const grid = document.getElementById("contentGrid");
  grid.innerHTML = "";

  let found = false;

  snapshot.forEach(docSnap => {
    const d = docSnap.data();

    // skip if category does not match
    if (!d.category || d.category !== category) return;

    found = true;

    grid.innerHTML += `
      <div class="card">
        ${d.imageUrl ? `<img src="${d.imageUrl.split(",")[0]}">` : ""}
        <h3>${d.title}</h3>
        <p>${d.description || ""}</p>
      </div>
    `;
  });

  // ✅ GUARANTEED EMPTY MESSAGE
  if (!found) {
    grid.innerHTML = `
      <div class="empty">
        No data here at present.<br>
        <small>Stay tuned for more updates…</small>
      </div>
    `;
  }
};
/// ================== RECENT UPDATES ==================
window.loadRecentUpdates = async function () {
  const q = query(collection(db, "content"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const list = document.getElementById("recentList");
  if (!list) return;

  list.innerHTML = "";

  let items = [];

  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    if (d.title && d.category) {
      items.push(d);
    }
  });

  // NO UPDATES
  if (items.length === 0) {
    list.innerHTML = `<div class="empty">No recent updates available</div>`;
    return;
  }

  // SHOW ONLY TOP 4
  const showItems = items.slice(0, 4);

  showItems.forEach(d => {
    const div = document.createElement("div");
    div.className = "recent-item";
    div.textContent = d.title;

    div.onclick = () => {
      document.getElementById("pageTitle").textContent =
        d.category.charAt(0).toUpperCase() + d.category.slice(1);

      document.getElementById("contentArea").innerHTML =
        `<div id="contentGrid"></div>`;

      window.loadContent(d.category);
    };

    list.appendChild(div);
  });

  // ✅ APPLY SCROLL ONLY IF AT LEAST 1 ITEM EXISTS
  if (showItems.length > 0) {
    list.innerHTML += list.innerHTML; // duplicate for infinite loop
    list.classList.add("scroll");
  }
};

