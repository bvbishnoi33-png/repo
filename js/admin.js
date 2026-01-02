import { collection, addDoc, getDocs, deleteDoc, doc } 
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById("contentForm");
const list = document.getElementById("adminList");

form.onsubmit = async e => {
  e.preventDefault();
  await addDoc(collection(db, "content"), {
    title: title.value,
    description: description.value,
    imageUrl: imageUrl.value,
    fileUrl: fileUrl.value,
    order: Number(order.value),
    createdAt: Date.now()
  });
  alert("Saved");
  location.reload();
};

const snapshot = await getDocs(collection(db, "content"));
snapshot.forEach(docu => {
  const d = docu.data();
  list.innerHTML += `<div class="card"><h3>${d.title}</h3>
  <button onclick="deleteDoc(doc(db,'content','${docu.id}'))">Delete</button></div>`;
});

