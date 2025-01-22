// First check if user is authorized
async function checkAuth() {
  try {
    const response = await fetch("/api/auth.php", {
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

// Load scoreboard when page loads
document.addEventListener("DOMContentLoaded", loadScoreboard);

async function logout() {
  try {
    await fetch("/api/logout.php");
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed");
  }
}
