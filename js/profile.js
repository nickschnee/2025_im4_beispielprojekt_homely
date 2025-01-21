// Check if user is logged in (reusing the same function we had before)
async function checkAuth() {
  try {
    const response = await fetch("/api/index.php", {
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

// Format date function
function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate()}.${date.getMonth() + 1}.${String(
    date.getFullYear()
  ).slice(2)}
            ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

// Load profile data
async function loadProfile() {
  const isAuthorized = await checkAuth();
  if (!isAuthorized) return;

  try {
    const response = await fetch("/api/profile/read.php");
    const data = await response.json();

    if (data.error) {
      console.error("Error loading profile:", data.error);
      return;
    }

    // Update user info
    document.getElementById("userName").textContent = data.user.name;
    document.getElementById("totalScore").textContent =
      data.user.total_score + " Punkte";

    // Update activities
    const container = document.getElementById("activitiesContainer");
    container.innerHTML = "";

    data.activities.forEach((activity) => {
      const div = document.createElement("div");
      div.className = "activity-item";
      div.innerHTML = `
                <div class="activity-left">
                    <div class="activity-date">${formatDate(
                      activity.timestamp
                    )}</div>
                    <div>${activity.emoji} ${activity.name}</div>
                </div>
                <div class="score">+${activity.score}</div>
            `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

// Reuse logout function
async function logout() {
  try {
    await fetch("/api/logout.php");
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout failed:", error);
    alert("Logout failed");
  }
}

// Load profile when page loads
document.addEventListener("DOMContentLoaded", loadProfile);
