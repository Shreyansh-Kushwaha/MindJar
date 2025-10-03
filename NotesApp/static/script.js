const API_URL = "/notes";

// Fetch and display notes
async function getNotes() {
    const res = await fetch(API_URL);
    const notes = await res.json();
    const container = document.getElementById("notes");
    container.innerHTML = "";

    if (notes.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">No notes yet. Add one above!</p>`;
        return;
    }

    notes.forEach(note => {
        const col = document.createElement("div");
        col.classList.add("col-md-4");

        col.innerHTML = `
            <div class="card note-card shadow-sm h-100">
                <div class="card-body">
                    <h5 class="card-title">${note.title}</h5>
                    <p class="card-text">${note.content}</p>
                    <button class="btn btn-danger btn-sm" onclick="deleteNote('${note.id}')">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Create a new note
document.getElementById("noteForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) return;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content })
    });

    document.getElementById("noteForm").reset();
    getNotes();
});

// Delete a note
async function deleteNote(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    getNotes();
}



// Light Theme Toggle
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('modeToggle');
    const body = document.body;

    // Load saved mode from localStorage (optional)
    if (localStorage.getItem('darkMode') === 'enabled') {
      body.classList.add('dark-mode');
    }

    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-mode');

      // Save mode preference
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
      } else {
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  });




// Load notes when page opens
getNotes();
