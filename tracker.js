
const form = document.getElementById("problemForm");
const topicInput = document.getElementById("topicInput");
const problemInput = document.getElementById("problemInput");
const problemsList = document.getElementById("problemsList");
const countDisplay = document.getElementById("count");

let activeTasks = JSON.parse(localStorage.getItem("activeTasks")) || [];  // active tasks displayed on screen
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || []; //completed tasks moved to table

let problems = JSON.parse(localStorage.getItem("problems")) || [];
// Load saved problems on page load
function loadActiveTasks() {
  problemsList.innerHTML = "";

  activeTasks.forEach((task, index) => {
    createProblemCard(task.topic, task.problem, index);
  });

  countDisplay.textContent = activeTasks.length;
}

loadActiveTasks();


// Handling form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const topic = topicInput.value.trim();
  const problem = problemInput.value.trim();

  if (!topic || !problem) return;

  activeTasks.push({ topic, problem });
  localStorage.setItem("activeTasks", JSON.stringify(activeTasks));

  loadActiveTasks();

  topicInput.value = "";
  problemInput.value = "";
});


// Create a card dynamically, remove when done
function createProblemCard(topic, problem, index) {
  const card = document.createElement("div");
  card.className = "card";

  const title = document.createElement("h3");
  title.textContent = topic;

  const link = document.createElement("a");
  link.href = problem;
  link.textContent = problem;
  link.target = "_blank";

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Done";
  removeBtn.className = "remove-btn";

  removeBtn.addEventListener("click", () => {
    completedTasks.push({
      topic,
      problem,
      date: new Date().toLocaleDateString()
    });

    activeTasks.splice(index, 1);

    localStorage.setItem("activeTasks", JSON.stringify(activeTasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

    loadActiveTasks();
    loadCompletedTasks();
  });

  card.appendChild(title);
  card.appendChild(link);
  card.appendChild(removeBtn);

  problemsList.appendChild(card);
}


function loadCompletedTasks() {
  const tbody = document.getElementById("completedBody");
  tbody.innerHTML = "";

  completedTasks.forEach(task => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.date}</td>
      <td>${task.topic}</td>
      <td><a href="${task.problem}" target="_blank">Link</a></td>
    `;

    tbody.appendChild(row);
  });
}

loadCompletedTasks();


