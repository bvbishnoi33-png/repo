import {
  collection, addDoc, getDocs, deleteDoc,
  doc, query, orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const form = document.getElementById("contentForm");
const list = document.getElementById("adminList");

form.onsubmit = async e => {
  e.preventDefault();

  await addDoc(collection(db,"content"),{
    title: title.value,
    description: description.value,
    category: category.value,
    type: type.value,
    mediaUrls: mediaUrls.value.split(",").map(v=>v.trim()).filter(Boolean),
    order: Number(order.value)||0,
    createdAt: Date.now()
  });

  form.reset();
  location.reload();
};

const q = query(collection(db,"content"),orderBy("order"));
const snap = await getDocs(q);

list.innerHTML = "";

snap.forEach(d=>{
  const data = d.data();
  const div = document.createElement("div");
  div.className="card";
  div.innerHTML=`
    <strong>${data.title}</strong>
    <p>${data.category} | ${data.type}</p>
    <button>Delete</button>
  `;
  div.querySelector("button").onclick = async ()=>{
    if(confirm("Delete this item?")){
      await deleteDoc(doc(db,"content",d.id));
      div.remove();
    }
  };
  list.appendChild(div);
});
