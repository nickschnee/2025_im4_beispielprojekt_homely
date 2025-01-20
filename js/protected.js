// protected.js
(async function () {
  try {
    // We call protected.php to see if the user is logged in
    const response = await fetch("api/protected.php", {
      // credentials: 'include', // uncomment if front-end & back-end are on different domains
    });

    if (response.status === 401) {
      // If not authorized, redirect to login
      window.location.href = "login.html";
      return;
    }

    // If authorized, protected.php will respond with JSON containing user data
    const data = await response.json();

    const contentDiv = document.getElementById("protectedContent");
    contentDiv.innerHTML = `
        <p>You are logged in as: <strong>${data.email}</strong></p>
        <p>Welcome to the protected area!</p>
      `;
  } catch (error) {
    console.error("Error fetching protected data:", error);
    // In case of any error, go to login
    window.location.href = "login.html";
  }
})();

// Logout button logic
document.getElementById("logoutBtn").addEventListener("click", () => {
  window.location.href = "api/logout.php";
});
