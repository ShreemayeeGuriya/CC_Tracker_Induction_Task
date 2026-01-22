const form = document.getElementById("contestForm");
const upcomingList = document.getElementById("upcomingList");
const pastList = document.getElementById("pastList");

let upcomingContests =
  JSON.parse(localStorage.getItem("upcomingContests")) || [];

let pastContests =
  JSON.parse(localStorage.getItem("pastContests")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("contestName").value;
  const platform = document.getElementById("platform").value;
  const date = document.getElementById("contestDate").value;
  const time = document.getElementById("time").value;

  // End of contest day (23:59:59)
  const endOfDay = new Date(`${date}T23:59:59`).getTime();

  upcomingContests.push({
    name,
    platform,
    date,
    time,
    endTimestamp: endOfDay
  });

  localStorage.setItem(
    "upcomingContests",
    JSON.stringify(upcomingContests)
  );

  form.reset();
  renderContests();
});

function updateContests() {
  const now = Date.now();

  upcomingContests = upcomingContests.filter(contest => {
    if (contest.endTimestamp < now) {
      pastContests.push(contest);
      return false; // move to past
    }
    return true;
  });

  localStorage.setItem("upcomingContests", JSON.stringify(upcomingContests));
  localStorage.setItem("pastContests", JSON.stringify(pastContests));
}

function renderContests() {
  updateContests();

  upcomingList.innerHTML = "";
  pastList.innerHTML = "";

  upcomingContests.forEach(c => {
    upcomingList.innerHTML += `
      <p>
        <strong>${c.name}</strong><br>
        • ${c.platform}<br>
         ${c.date} ${c.time}
      </p>
    `;
  });

  pastContests.forEach(c => {
    pastList.innerHTML += `
      <p>
        <strong>${c.name}</strong><br>
        • ${c.platform}<br>
         ${c.date}  ${c.time}
      </p>
    `;
  });
}

renderContests();
setInterval(renderContests, 60000); // auto check every minute
