// First check if user is authorized
async function checkAuth() {
  try {
    const response = await fetch("/api/index.php", { credentials: "include" });
    // ^ IMPORTANT if you need cookies

    // If server returns 401:
    if (response.status === 401) {
      window.location.href = "/login.html";
      return false;
    }

    // Otherwise parse the JSON
    const result = await response.json();

    // Possibly check if result has an error:
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

// Function to load and display all tasks
async function loadTasks() {
  // First check authorization
  const isAuthorized = await checkAuth();
  if (!isAuthorized) return;

  try {
    const response = await fetch("/api/tasks/read.php");
    const tasks = await response.json();

    if (!tasks || tasks.error) {
      console.error("Error loading tasks:", tasks.error);
      return;
    }

    const container = document.getElementById("tasks-container");
    container.innerHTML = ""; // Clear existing tasks

    tasks.forEach((task) => {
      const button = document.createElement("button");
      button.className = "task-button";
      button.innerHTML = `
                ${task.name} 
                <span class="task-score">${task.score} points</span>
            `;
      button.onclick = () => completeTask(task.id);
      container.appendChild(button);
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

// Function to complete a task
async function completeTask(taskId) {
  try {
    const response = await fetch("/api/tasks/complete.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_id: taskId,
      }),
    });

    const result = await response.json();

    if (result.error) {
      alert(result.error);
      return;
    }

    if (result.message) {
      alert("Task completed successfully!");
      loadTasks();
    }
  } catch (error) {
    console.error("Error completing task:", error);
    alert("Error completing task. Please try again.");
  }
}

// Load tasks when page loads
document.addEventListener("DOMContentLoaded", loadTasks);
