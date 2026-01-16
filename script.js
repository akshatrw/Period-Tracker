let cycles = JSON.parse(localStorage.getItem("periodCycles") || "[]");

function saveCycles() {
  localStorage.setItem("periodCycles", JSON.stringify(cycles));
  updateTable();
  updateChart();
}

function addEntry() {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;
  const flow = document.getElementById("flow").value;
  const mood = document.getElementById("mood").value;

  if(!start || !end) { alert("Please fill all fields 💖"); return; }

  const length = (new Date(end) - new Date(start))/(1000*60*60*24)+1;
  cycles.push({start, end, flow, mood, length});
  saveCycles();
  predictNext();
}

function updateTable() {
  const table = document.getElementById("cycleTable");
  table.innerHTML = "<tr><th>#</th><th>Start</th><th>End</th><th>Flow</th><th>Mood</th><th>Length (days)</th></tr>";
  cycles.forEach((c,i)=>{
    const row = table.insertRow();
    row.insertCell(0).innerText = i+1;
    row.insertCell(1).innerText = c.start;
    row.insertCell(2).innerText = c.end;
    row.insertCell(3).innerText = c.flow;
    row.insertCell(4).innerText = c.mood;
    row.insertCell(5).innerText = c.length;
  });
}

function predictNext() {
  if(cycles.length<2) {
    document.getElementById("predictionText").innerText="Add at least 2 cycles for prediction ❤️";
    return;
  }
  let totalLen = cycles.reduce((sum,c)=>sum+c.length,0);
  let avgLen = Math.round(totalLen / cycles.length);
  const lastEnd = new Date(cycles[cycles.length-1].end);
  const nextStart = new Date(lastEnd.getTime() + avgLen*24*60*60*1000);
  document.getElementById("predictionText").innerText=`Next period may start around: ${nextStart.toISOString().split("T")[0]} (avg cycle: ${avgLen} days)`;
}

// Chart.js
function updateChart() {
  const ctx = document.getElementById('cycleChart').getContext('2d');
  const labels = cycles.map(c=>c.start);
  const lengths = cycles.map(c=>c.length);
  if(window.cycleGraph) window.cycleGraph.destroy();
  window.cycleGraph = new Chart(ctx,{
    type:'line',
    data:{ labels: labels, datasets:[{label:'Cycle Length', data:lengths, borderColor:'#c2185b', backgroundColor:'#f8bbd0', tension:0.3}]},
    options:{ responsive:true, scales:{ y:{ beginAtZero:true, precision:0 } } }
  });
}

updateTable();
predictNext();
updateChart();
