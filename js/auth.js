import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Login required");
    window.location.href = "/";
  }
});

