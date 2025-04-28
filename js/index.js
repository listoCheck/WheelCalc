let endCount = 0;
let realKills = 0
let killPoints = 0;
let startTime;
let killCount = 0;
let progressHistory = []
let fightHistory = []

google.charts.load('current', {packages: ['corechart']});

document.getElementById("count").addEventListener("click", wheelStart);

document.getElementById("countFight").addEventListener("click", pointCount);

document.getElementById("lost").addEventListener("click", lostMake);

const inputsStart = document.querySelectorAll('.calc-start');
inputsStart.forEach(input => {
    input.addEventListener('keypress', function (e) {
        if (e.key === "Enter") {
            wheelStart();
        }
    });
});

const inputs = document.querySelectorAll('.calc-input');
inputs.forEach(input => {
    input.addEventListener('keypress', function (e) {
        if (e.key === "Enter") {
            pointCount();
        }
    });
});

const inputsLost = document.querySelectorAll('.calc-lost');
inputsLost.forEach(input => {
    input.addEventListener('keypress', function (e) {
        if (e.key === "Enter") {
            lostMake();
        }
    });
});

function wheelStart() {
    startTime = Date.now();
    if (document.getElementById("setUp").checked) {
        killCount = 70;
    } else {
        killCount = 50;
    }
    const wheelMoney = parseFloat(document.getElementById("wheelMoney").value);
    killCount += Math.floor(wheelMoney / 150);
    document.getElementById("killCount").textContent = killCount;
    sendedData("СТАААААРТУЕММ")
    document.getElementById("wheelMoney").disabled = true;
    document.getElementById("setUp").disabled = true;
    document.getElementById("count").disabled = true;
}

function pointCount() {
    const kills = parseInt(document.getElementById("frags").value) || 0;
    const assists = parseInt(document.getElementById("assists").value) || 0;
    const points = parseInt(document.getElementById("points").value) || 0;
    const drones = parseInt(document.getElementById("drones").value) || 0;
    const aerodinahui = parseInt(document.getElementById("aerodinahui").value) || 0;
    const heliPoint = parseInt(document.getElementById("heliPoint").value) || 0;
    const _2500 = document.getElementById("_2500").checked ? 4 : 0;
    const nuke = document.getElementById("nuke").checked ? 4 : 0;
    realKills += kills;
    killPoints += aerodinahui + (0.25 * assists) + 0.5 * (points + drones) + (2 * heliPoint) + _2500 + nuke;
    endCount = realKills + killPoints;
    if (endCount >= killCount) {
        sendedData(`ГООООООООООООЛ, колесо окончено, выполнил за ${(Date.now() - startTime)/(1000*60*60)} часов`);
    }
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    addRowToHistoryTable(kills, assists, points, drones, aerodinahui, heliPoint, _2500, nuke, aerodinahui + (0.25 * assists) + (0.5 * (points + drones)) + (2 * heliPoint) + _2500 + nuke);
    progressHistory.push([progressHistory.length + 1, endCount, timeString]);
    document.getElementById("totalCount").textContent = `${realKills} (${killPoints}) {${endCount}}`;

    document.getElementById("frags").value = "";
    document.getElementById("assists").value = "";
    document.getElementById("points").value = "";
    document.getElementById("drones").value = "";
    document.getElementById("aerodinahui").value = "";
    document.getElementById("heliPoint").value = "";
    document.getElementById("_2500").checked = false;
    document.getElementById("nuke").checked = false;
    drawPieChart(realKills, killPoints);
    drawLineChart(progressHistory);
}

function lostMake() {
    realKills = parseInt(document.getElementById("killsLost").value) || 0;
    killPoints = parseFloat(document.getElementById("pointsLost").value) || 0;
    startTime = Date.now();
    endCount = realKills + killPoints;
    document.getElementById("totalCount").textContent = `${realKills} (${killPoints}) {${endCount}}`;
    drawPieChart(realKills, killPoints);
}
function makeStats() {
    if (!startTime) return;
    const currentTime = Date.now();
    const elapsedMinutes = (currentTime - startTime) / 60000;
    const totalPoints = realKills + killPoints;
    const pointsPerMinute = (totalPoints / elapsedMinutes).toFixed(2);
    document.getElementById("totalCount").textContent = `Производительность: ${pointsPerMinute} очков в минуту`;
}


function drawPieChart(realKills, killPoints) {
    let c = killCount - realKills - killPoints;
    if (c < 0) {
        c = 0;
    }
    const data = google.visualization.arrayToDataTable([['Тип', 'Количество'], ['Остаток', c], ['Киллы', realKills], ['Очки', killPoints],]);

    const options = {
        backgroundColor: 'transparent',
        pieHole: 0.4,
        colors: ["tomato", "green", "blue"],
        chartArea: {width: '100%', height: '120%'},
        legend: {textStyle: {fontSize: 13}},
        tooltip: {text: 'percentage'}
    };

    const pieChart = new google.visualization.PieChart(document.getElementById('pie-chart'));
    pieChart.draw(data, options);
}

function drawLineChart(progressHistory) {
    const dataArray = [['Номер подсчета', 'Фраго-Очки', { role: 'tooltip', type: 'string', p: { html: true } }]];

    progressHistory.forEach(([index, points, time]) => {
        dataArray.push([index, points, `Очки: ${points}\nВремя: ${time}`]);
    });

    const data = google.visualization.arrayToDataTable(dataArray);

    const options = {
        title: 'Прогресс выполнения',
        backgroundColor: 'transparent',
        colors: ['mediumseagreen'],
        pointSize: 5,
        curveType: 'function',
        legend: { position: 'bottom' },
        chartArea: { width: '80%', height: '70%' },
        vAxis: { minValue: 0 },
        tooltip: { isHtml: true }
    };

    const chart = new google.visualization.LineChart(document.getElementById('line-chart'));
    chart.draw(data, options);
}

function addRowToHistoryTable(fragCount, assistCount, pointCount, droneCount, aerodinahuiCount, heliPointCount, is2500, isNuke, totalPoints) {
    const tableBody = document.querySelector("#history-table tbody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${tableBody.children.length + 1}</td>
        <td>${fragCount}</td>
        <td>${assistCount}</td>
        <td>${pointCount}</td>
        <td>${droneCount}</td>
        <td>${aerodinahuiCount}</td>
        <td>${heliPointCount}</td>
        <td>${is2500 ? "Да" : "Нет"}</td>
        <td>${isNuke ? "Да" : "Нет"}</td>
        <td>${totalPoints}</td>
    `;
    fightHistory = [fragCount, assistCount, pointCount, droneCount, aerodinahuiCount, heliPointCount, is2500, isNuke, totalPoints]
    tableBody.appendChild(newRow);
}
function sendedData(message) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.style.display = 'block';
    popup.style.backgroundColor = 'green';
    setTimeout(function () {
        popup.style.display = 'none';
    }, 3000);
}

document.getElementById("edit_button").addEventListener("click", function () {
    document.getElementById("frags").value = fightHistory[0];
    document.getElementById("assists").value = fightHistory[1];
    document.getElementById("points").value = fightHistory[2];
    document.getElementById("drones").value = fightHistory[3];
    document.getElementById("aerodinahui").value = fightHistory[4];
    document.getElementById("heliPoint").value = fightHistory[5];
    document.getElementById("_2500").checked = fightHistory[6];
    document.getElementById("nuke").checked = fightHistory[7];
    realKills -= fightHistory[0];
    killPoints -= fightHistory[8];
    endCount = realKills + killPoints;
    const historyTable = document.getElementById('history-table');
    const rows = historyTable.getElementsByTagName('tr');
    if (rows.length > 1) { // чтобы не удалить заголовок
        historyTable.deleteRow(rows.length - 1);
    }
    progressHistory.pop();
    drawPieChart(realKills, killPoints);
    drawLineChart(progressHistory);
    document.getElementById("totalCount").textContent = `${realKills} (${killPoints}) {${endCount}}`;
});

const inputData = document.querySelectorAll('.calc-start, .calc-input, .calc-lost');
inputData.forEach(input =>{
    input.addEventListener('input', function (){
        this.value = this.value.replace(/[^0-9]*/g, '');
    });
});