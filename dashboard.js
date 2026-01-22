// Load data
const completedTasks =
  JSON.parse(localStorage.getItem("completedTasks")) || [];

const activeTasks =
  JSON.parse(localStorage.getItem("activeTasks")) || [];

const revisionData =
  JSON.parse(localStorage.getItem("revisionData")) || [];

const upcomingContests =
  JSON.parse(localStorage.getItem("upcomingContests")) || [];

  function resetApp() {
  localStorage.clear();
  alert("All data cleared!");
  location.reload();
}

// Elements
const solvedCount = document.getElementById("solvedCount");
const revisionCount = document.getElementById("revisionCount");
const pendingCount = document.getElementById("pendingCount");
const nextContest = document.getElementById("nextContest");
const lastRevised = document.getElementById("lastRevised");

// 1️⃣ Problems solved
solvedCount.textContent = completedTasks.length;

// 2️⃣ Pending tasks
pendingCount.textContent = activeTasks.length;

// 3️⃣ Problems to revise
let totalRevisionProblems = 0;
revisionData.forEach(topic => {
  totalRevisionProblems += topic.problems.length;
});
revisionCount.textContent = totalRevisionProblems;

// 4️⃣ Last revised
if (completedTasks.length > 0) {
  const last = completedTasks[completedTasks.length - 1];
  lastRevised.textContent = `${last.topic} (${last.date})`;
} else {
  lastRevised.textContent = "None yet";
}

// 5️⃣ Days remaining for next contest
function updateNextContest() {
  const contests =
    JSON.parse(localStorage.getItem("upcomingContests")) || [];

  const nextContestEl = document.getElementById("nextContest");

  if (contests.length === 0) {
    nextContestEl.textContent = "No upcoming contests";
    return;
  }

  // find nearest contest
  const now = Date.now();

  const sorted = contests.sort(
    (a, b) => a.timestamp - b.endTimestamp
  );

  const next = sorted[0];

  const diffMs = next.endTimestamp - now;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  nextContestEl.textContent =
    daysLeft > 0 ? `${daysLeft} day(s)` : "Today";
}

updateNextContest();
setInterval(updateNextContest, 60000); // auto refresh every minute

document.getElementById("resetBtn")?.addEventListener("click", () => {
  const confirmReset = confirm(
    "This will permanently delete all your data. Continue?"
  );

  if (!confirmReset) return;

  localStorage.clear();
  alert("All data cleared successfully!");
  location.reload();
});

