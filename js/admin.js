import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById("contentForm");
const list = document.getElementById("adminList");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "content"), {
    title: title.value,
    description: description.value,
    category: category.value,

    // ✅ NEW
    externalLink: externalLink.value || "",

    // ✅ MULTIPLE MEDIA URLS
    mediaUrls: mediaUrls.value
      ? mediaUrls.value.split(",").map(v => v.trim()).filter(Boolean)
      : [],

    createdAt: Date.now()
  });

  form.reset();
  location.reload();
});

/* LIST + DELETE */
const snap = await getDocs(collection(db, "content"));
list.innerHTML = "";

snap.forEach(d => {
  const x = d.data();
  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <strong>${x.title}</strong><br>
    <small>${x.category}</small>
    <button class="delete">Delete</button>
  `;
  div.querySelector(".delete").onclick = async () => {
    if (confirm("Delete this update?")) {
      await deleteDoc(doc(db, "content", d.id));
      div.remove();
    }
  };
  list.appendChild(div);
});
