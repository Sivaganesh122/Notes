// frontend/script.js

const API = "http://localhost:3000";

// REGISTER
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message);
    window.location.href = "login.html";
  };
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert("Login failed");
    }
  };
}

// SHOW NOTES
if (window.location.pathname.includes("index.html")) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
  }

  const fetchNotes = async () => {
    const res = await fetch(`${API}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    const list = document.getElementById('notesList');
    list.innerHTML = '';
    data.notes.forEach(note => {
      const li = document.createElement('li');
      li.textContent = note;
      list.appendChild(li);
    });
  };

  fetchNotes();

  document.getElementById('saveNote').onclick = async () => {
    const note = document.getElementById('noteInput').value;
    await fetch(`${API}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ note })
    });

    document.getElementById('noteInput').value = '';
    fetchNotes();
  };
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
