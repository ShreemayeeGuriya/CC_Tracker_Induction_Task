const topicInput = document.getElementById("topicInput");
const problemInput = document.getElementById("problemInput");
const createTopicBtn = document.getElementById("createTopicBtn");
const addProblemBtn = document.getElementById("addProblemBtn");

let revisionData =
  JSON.parse(localStorage.getItem("revisionData")) || [];

let revisedProblems =
  JSON.parse(localStorage.getItem("revisedProblems")) || [];

let currentTopicIndex = null;


// Create new topic
createTopicBtn.addEventListener("click", () => {
  const topic = topicInput.value.trim();
  if (!topic) return;

  revisionData.push({ topic, problems: [] });
  localStorage.setItem("revisionData", JSON.stringify(revisionData));

  currentTopicIndex = revisionData.length - 1;
  topicInput.value = "";

  renderRevision();
});

// Add problem to current topic
addProblemBtn.addEventListener("click", () => {
  const problem = problemInput.value.trim();   
  if (!problem.startsWith("http")) {     // if https not present
  problem = "https://" + problem;
}

  if (!problem || currentTopicIndex === null) return;

  revisionData[currentTopicIndex].problems.push(problem);
  localStorage.setItem("revisionData", JSON.stringify(revisionData));

  problemInput.value = "";
  renderRevision();
});

function createRevisionCard(topic, problem, topicIndex, problemIndex) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${topic}</h3>
    <a href="${problem}" target="_blank">${problem}</a>
    <button class="done-btn">Done</button>
  `;

  card.querySelector(".done-btn").addEventListener("click", () => {
    markRevisionDone(topicIndex, problemIndex);
  });

  document.getElementById("revisionCards").appendChild(card);
}


 function markRevisionDone(topicIndex, problemIndex) {
  const topicObj = revisionData[topicIndex];
  const problem = topicObj.problems[problemIndex];

  // add to completed table
  revisedProblems.push({
    topic: topicObj.topic,
    problem: problem,
    date: new Date().toLocaleDateString()
  });

  // remove from pending revision
  topicObj.problems.splice(problemIndex, 1);

  // remove topic if empty
  if (topicObj.problems.length === 0) {
    revisionData.splice(topicIndex, 1);
  }

  // save
  localStorage.setItem("revisionData", JSON.stringify(revisionData));
  localStorage.setItem("revisedProblems", JSON.stringify(revisedProblems));

  renderRevision();
}




// Render everything
function renderRevision() {
  const cards = document.getElementById("revisionCards");
  const table = document.getElementById("revisionTable");

  cards.innerHTML = "";
  table.innerHTML = "";

  // pending cards
  revisionData.forEach((topicObj, tIndex) => {
    topicObj.problems.forEach((problem, pIndex) => {
      createRevisionCard(topicObj.topic, problem, tIndex, pIndex);
    });
  });

  // completed table
  revisedProblems.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.topic}</td>
      <td><a href="${item.problem}" target="_blank" rel="noopener noreferrer">
      ${item.problem}
      </a></td>
      <td>${item.date}</td>
    `;

    table.appendChild(row);
  });
}

renderRevision();
