import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById("contentForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await addDoc(collection(db, "content"), {
    category: category.value,
    type: type.value,
    title: title.value,
    description: description.value,
    mediaUrls: mediaUrls.value.split(",").map(v => v.trim()),
    order: Number(order.value) || 0,
    createdAt: Date.now()
  });

  alert("Saved successfully");
  form.reset();
});
