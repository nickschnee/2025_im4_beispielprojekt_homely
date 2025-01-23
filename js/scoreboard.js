// First check if user is authorized
async function checkAuth() {
  try {
    const response = await fetch("/api/auth/auth.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "/login.html";
      return false;
    }

    const result = await response.json();

    if (result.error || !result.email) {
      window.location.href = "/login.html";
      return false;
    }
    return true;
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/login.html";
    return false;
  }
}

let isEditMode = false;

function toggleEditMode() {
  isEditMode = !isEditMode;
  const addFriendForm = document.getElementById("addFriendForm");
  const editButton = document.getElementById("editButton");
  const deleteColumns = document.querySelectorAll(".delete-column");

  if (isEditMode) {
    addFriendForm.classList.remove("hidden");
    editButton.textContent = "Fertig";
    deleteColumns.forEach((col) => col.classList.remove("hidden"));
  } else {
    addFriendForm.classList.add("hidden");
    editButton.textContent = "Mitglieder bearbeiten";
    deleteColumns.forEach((col) => col.classList.add("hidden"));
  }
}

// Function to load and display scoreboard
async function loadScoreboard() {
  const isAuthorized = await checkAuth();
  if (!isAuthorized) return;

  try {
    const response = await fetch("/api/scoreboard/read.php");
    const scores = await response.json();

    if (!scores || scores.error) {
      console.error("Error loading scores:", scores.error);
      return;
    }

    const tbody = document.getElementById("scoreboard-body");
    tbody.innerHTML = ""; // Clear existing scores

    scores.forEach((score, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${score.name}</td>
        <td>${score.total_score}</td>
        <td class="delete-column ${!isEditMode ? "hidden" : ""}">
          <button 
            onclick="deleteFriend('${score.email}')"
            class="delete-btn"
            ${score.email === score.currentUserEmail ? "disabled" : ""}>
            Löschen
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading scoreboard:", error);
  }
}

// Add friend function
async function addFriend() {
  const friendEmail = document.getElementById("friendEmail").value.trim();

  if (!friendEmail) {
    alert("Please enter your friend's email");
    return;
  }

  try {
    const response = await fetch("/api/scoreboard/add_friend.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendEmail }),
    });

    const result = await response.json();

    if (result.error) {
      alert(result.error);
      return;
    }

    alert("Friend added successfully!");
    document.getElementById("friendEmail").value = "";
    loadScoreboard(); // Reload the scoreboard
  } catch (error) {
    console.error("Error adding friend:", error);
    alert("Failed to add friend");
  }
}

async function deleteFriend(friendEmail) {
  if (
    !confirm("Möchtest du dieses Mitglied wirklich aus deiner Liste entfernen?")
  ) {
    return;
  }

  try {
    const response = await fetch("/api/scoreboard/delete_friend.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendEmail }),
    });

    const result = await response.json();

    if (result.error) {
      alert(result.error);
      return;
    }

    alert("Mitglied wurde erfolgreich entfernt");
    loadScoreboard(); // Refresh the list
  } catch (error) {
    console.error("Error deleting friend:", error);
    alert("Fehler beim Entfernen des Mitglieds");
  }
}

// Load scoreboard when page loads
document.addEventListener("DOMContentLoaded", loadScoreboard);
