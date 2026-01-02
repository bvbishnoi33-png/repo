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

