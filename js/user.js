import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ================= CONTENT LOADER ================= */
window.loadContent = async function (category, focusTitle = null) {
  const grid = document.getElementById("grid");
  const q = query(collection(db, "content"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  grid.innerHTML = "";
  let found = false;
  let targetElement = null;

  snap.forEach(d => {
    const x = d.data();
    if (x.category !== category) return;

    found = true;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${x.title}</strong>
      <p>${x.description || ""}</p>
    `;

    // mark card if it matches clicked recent update
    if (focusTitle && x.title === focusTitle) {
      card.style.border = "2px solid #2563eb";
      targetElement = card;
    }

    grid.appendChild(card);
  });

  if (!found) {
    grid.innerHTML = `
      <div class="card">
        <em>No updates at the moment. Please stay tuned for further announcements.</em>
      </div>
    `;
    return;
  }

  // scroll to the clicked update
  if (targetElement) {
    setTimeout(() => {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }
};

/* ================= RECENT UPDATES ================= */
window.loadRecent = async function () {
  const box = document.getElementById("recent");
  const q = query(collection(db, "content"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);

  let items = [];
  snap.forEach(d => items.push(d.data()));

  // NO UPDATES
  if (items.length === 0) {
    box.innerHTML = `
      <em style="color:#64748b">
        No updates at the moment. Please stay tuned for further announcements.
      </em>
    `;
    return;
  }

  // SHOW MAX 4
  const showItems = items.slice(0, 4);
  box.innerHTML = "";

  showItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "recent-item";
    div.textContent = item.title;

    div.onclick = () => {
      // open correct section and focus the update
      document.getElementById("pageTitle").textContent =
        item.category.toUpperCase();

      document.getElementById("content").innerHTML = `<div id="grid"></div>`;

      window.loadContent(item.category, item.title);
    };

    box.appendChild(div);
  });

  /* 🔥 SCROLL ONLY WHEN 2+ ITEMS */
  if (showItems.length > 1) {
    box.innerHTML += box.innerHTML; // duplicate for looping
    box.classList.add("scroll");
  } else {
    box.classList.remove("scroll");
  }
};
