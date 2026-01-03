import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* LOAD CATEGORY CONTENT */
window.loadContent = async function(category){
  const list=document.getElementById("list");
  const q=query(collection(db,"content"),orderBy("createdAt","desc"));
  const snap=await getDocs(q);

  list.innerHTML="";
  let found=false;

  snap.forEach(d=>{
    const x=d.data();
    if(x.category!==category) return;
    found=true;

    list.innerHTML+=`
      <div class="update">
        <div class="update-title">${x.title}</div>
        <div class="update-desc">${x.description||""}</div>
      </div>
    `;
  });

  if(!found){
    list.innerHTML=`
      <div class="update empty">
        No updates at the moment. Please stay tuned for further announcements.
      </div>
    `;
  }
};

/* LOAD RECENT UPDATES */
window.loadRecent = async function(){
  const box=document.getElementById("recent");
  const q=query(collection(db,"content"),orderBy("createdAt","desc"));
  const snap=await getDocs(q);

  let items=[];
  snap.forEach(d=>items.push(d.data()));

  if(items.length===0){
    box.innerHTML=`
      <div class="empty">
        No updates at the moment. Please stay tuned for further announcements.
      </div>
    `;
    return;
  }

  box.innerHTML="";
  items.slice(0,6).forEach(i=>{
    const div=document.createElement("div");
    div.className="recent-item";
    div.textContent=i.title;
    div.onclick = () => {
  closeMenu();          // 🔒 force close
  load(i.category);     // navigate
};

    box.appendChild(div);
  });
};
