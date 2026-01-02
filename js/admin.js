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

/* ---------------- ADD CONTENT ---------------- */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "content"), {
    title: title.value,
    description: description.value,
    imageUrl: imageUrl.value,
    fileUrl: fileUrl.value,
    order: Number(order.value) || 0,
    createdAt: Date.now()
  });

  alert("Content saved");
  form.reset();
  location.reload();
});

/* ---------------- LOAD CONTENT ---------------- */
const q = query(collection(db, "content"), orderBy("order"));
const snapshot = await getDocs(q);

list.innerHTML = "";

snapshot.forEach((docSnap) => {
  const data = docSnap.data();
  const id = docSnap.id;

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.description || ""}</p>
    <button class="delete-btn">Delete</button>
  `;

  // 🔥 GUARANTEED DELETE
  card.querySelector(".delete-btn").onclick = async () => {
    const confirmDelete = confirm("Delete this item?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "content", id));
    card.remove(); // instant UI removal
  };

  list.appendChild(card);
});
