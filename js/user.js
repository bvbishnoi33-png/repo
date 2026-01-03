import {
  collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

window.loadContent = async function(category){
  const q=query(collection(db,"content"),orderBy("order"));
  const snap=await getDocs(q);
  const grid=document.getElementById("contentGrid");
  grid.innerHTML="";
  let found=false;

  snap.forEach(d=>{
    const data=d.data();
    if(data.category!==category) return;
    found=true;

    const card=document.createElement("div");
    card.className="card";

    card.innerHTML=`<h3>${data.title}</h3><p>${data.description||""}</p>`;

    if(data.type==="image"){
      data.mediaUrls.forEach(url=>{
        const img=document.createElement("img");
        img.src=url;
        img.onclick=()=>openModal(url);
        card.appendChild(img);
      });
    }

    grid.appendChild(card);
  });

  if(!found){
    grid.innerHTML=`<div class="card">No data here at present. Stay tuned for more updates…</div>`;
  }
};
