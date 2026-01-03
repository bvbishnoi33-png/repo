import {
  collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

window.loadContent = async cat=>{
  const grid=document.getElementById("grid");
  const snap=await getDocs(collection(db,"content"));
  grid.innerHTML="";
  let found=false;

  snap.forEach(d=>{
    const x=d.data();
    if(x.category!==cat) return;
    found=true;
    grid.innerHTML+=`<div class="card"><strong>${x.title}</strong><p>${x.description||""}</p></div>`;
  });

  if(!found){
    grid.innerHTML=`<div class="card"><em>No updates at the moment. Please stay tuned for further announcements.</em></div>`;
  }
};

window.loadRecent = async ()=>{
  const box=document.getElementById("recent");
  const q=query(collection(db,"content"),orderBy("createdAt","desc"));
  const snap=await getDocs(q);

  let items=[];
  snap.forEach(d=>items.push(d.data()));

  if(items.length===0){
    box.innerHTML="<em>No updates at the moment. Please stay tuned for further announcements.</em>";
    return;
  }

  box.innerHTML="";
  items.slice(0,4).forEach(i=>{
    const div=document.createElement("div");
    div.textContent=i.title;
    div.onclick=()=>load(i.category);
    box.appendChild(div);
  });

  box.innerHTML+=box.innerHTML;
  box.classList.add("scroll");
};
