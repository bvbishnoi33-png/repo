import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById("contentForm");
const list = document.getElementById("adminList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🔥 THESE IDS MUST EXIST
  const category = document.getElementById("category").value;
  const type = document.getElementById("type").value;

  if (!category) {
    alert("Please select a category");
    return;
  }

  await addDoc(collection(db, "content"), {
    title: title.value,
    description: description.value,
    category: category,
    type: type,
    mediaUrls: mediaUrls.value
      ? mediaUrls.value.split(",").map(v => v.trim())
      : [],
    order: Number(order.value) || 0,
    createdAt: Date.now()
  });

  alert("Content saved");
  form.reset();
  location.reload();
});

// LOAD ADMIN CONTENT
const q = query(collection(db, "content"), orderBy("order"));
const snapshot = await getDocs(q);

list.innerHTML = "";

snapshot.forEach(docSnap => {
  const d = docSnap.data();

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <strong>${d.title}</strong><br>
    <small>Category: ${d.category} | Type: ${d.type}</small>
    <button style="margin-top:10px;background:#dc2626">Delete</button>
  `;

  card.querySelector("button").onclick = async () => {
    if (confirm("Delete this item?")) {
      await deleteDoc(doc(db, "content", docSnap.id));
      card.remove();
    }
  };

  list.appendChild(card);
});
