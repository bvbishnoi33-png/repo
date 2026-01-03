import {
  collection, addDoc, getDocs, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById("contentForm");
const list = document.getElementById("adminList");

form.onsubmit = async e => {
  e.preventDefault();

  await addDoc(collection(db,"content"),{
    title: title.value,
    description: description.value,
    category: category.value,
    mediaUrls: mediaUrls.value.split(",").map(v=>v.trim()).filter(Boolean),
    createdAt: Date.now()
  });

  form.reset();
  location.reload();
};

const snap = await getDocs(collection(db,"content"));
list.innerHTML = "";

snap.forEach(d=>{
  const data = d.data();
  const div = document.createElement("div");
  div.className="card";
  div.innerHTML = `
    <strong>${data.title}</strong>
    <small>(${data.category})</small>
    <button class="delete">Delete</button>
  `;
  div.querySelector(".delete").onclick = async ()=>{
    if(confirm("Delete this update?")){
      await deleteDoc(doc(db,"content",d.id));
      div.remove();
    }
  };
  list.appendChild(div);
});
