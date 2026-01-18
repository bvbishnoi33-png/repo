import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* LOAD CATEGORY CONTENT */
window.loadContent = async function(category){
  const list = document.getElementById("list");
  const q = query(collection(db,"content"), orderBy("createdAt","desc"));
  const snap = await getDocs(q);

  list.innerHTML = "";
  let found = false;

  snap.forEach(d => {
    const x = d.data();
    if (x.category !== category) return;
    found = true;

    const block = document.createElement("div");
    block.className = "update";

    /* TITLE + DESC */
    block.innerHTML = `
      <div class="update-title">${x.title}</div>
      ${x.description ? `<div class="update-desc">${x.description}</div>` : ""}
    `;

    /* 🔗 EXTERNAL LINK */
    if (x.externalLink) {
      const linkBtn = document.createElement("a");
      linkBtn.href = x.externalLink;
      linkBtn.target = "_blank";
      linkBtn.textContent = "Open Link";
      linkBtn.style.cssText = `
        display:inline-block;
        margin-top:10px;
        padding:8px 14px;
        background:#0f172a;
        color:white;
        border-radius:6px;
        text-decoration:none;
      `;
      block.appendChild(linkBtn);
    }

    /* 🖼️ IMAGE GRID */
    if (category === "images" && x.mediaUrls?.length) {
      const grid = document.createElement("div");
      grid.style.cssText = `
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
        gap:10px;
        margin-top:10px;
      `;

      x.mediaUrls.forEach(url => {
        const img = document.createElement("img");
        img.src = url;
        img.style.cssText = `
          width:100%;
          border-radius:6px;
          cursor:pointer;
        `;
        img.onclick = () => openImage(url);
        grid.appendChild(img);
      });

      block.appendChild(grid);
    }

    /* 🎥 VIDEO GRID */
    if (category === "videos" && x.mediaUrls?.length) {
      const grid = document.createElement("div");
      grid.style.cssText = `
        display:grid;
        grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
        gap:10px;
        margin-top:10px;
      `;

      x.mediaUrls.forEach(url => {
        const vid = document.createElement("video");
        vid.src = url;
        vid.controls = true;
        vid.style.cssText = `
          width:100%;
          border-radius:6px;
          cursor:pointer;
        `;
        vid.onclick = () => openVideo(url);
        grid.appendChild(vid);
      });

      block.appendChild(grid);
    }

    list.appendChild(block);
  });

  if (!found) {
    list.innerHTML = `
      <div class="update empty">
        No updates at the moment. Please stay tuned for further announcements.
      </div>
    `;
  }
};

/* LOAD RECENT UPDATES */
window.loadRecent = async function(){
  const box = document.getElementById("recent");
  const q = query(collection(db,"content"), orderBy("createdAt","desc"));
  const snap = await getDocs(q);

  let items = [];
  snap.forEach(d => items.push(d.data()));

  if (!items.length) {
    box.innerHTML = `
      <div class="empty">
        No updates at the moment. Please stay tuned for further announcements.
      </div>
    `;
    return;
  }

  box.innerHTML = "";
  items.slice(0,6).forEach(i => {
    const div = document.createElement("div");
    div.className = "recent-item";
    div.textContent = i.title;
    div.onclick = () => load(i.category);
    box.appendChild(div);
  });
};
