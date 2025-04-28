let endCount = 0;
let realKills = 0
let killPoints = 0;
let startTime;
let killCount = 0;
let progressHistory = []
let fightHistory = []
let remake = false;
let input = true;
let vehicle = "";
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
    killCount = parseInt(localStorage.getItem('killCount')) || 0;
    vehicle = localStorage.getItem('vehicle') || null;
    console.log(killCount)
    startTime = Date.now();
    let myFlag = false;
    if (killCount === 0) {
        myFlag = true;
        if (document.getElementById("setUp").checked) {
            killCount = 70;
        } else {
            killCount = 50;
        }
    }
    const wheelMoney = parseFloat(document.getElementById("wheelMoney").value);
    if (isNaN(wheelMoney) && myFlag) {
        sendedData("ПУСТО, надо ввести в деньги за колесо")
        return;
    }
    if (myFlag) killCount += Math.floor(wheelMoney / 150);
    document.getElementById("killCount").textContent = killCount;
    sendedData("СТАААААРТУЕММ")
    document.getElementById("wheelMoney").disabled = true;
    document.getElementById("setUp").disabled = true;
    document.getElementById("count").disabled = true;
    localStorage.setItem('killCount', 0);
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
        sendedData(`ГООООООООООООЛ, колесо окончено, выполнил за ${(Date.now() - startTime) / (1000 * 60 * 60)} часов`);
        document.getElementById("endStats").textContent = killPoints / ((Date.now() - startTime) / (1000 * 60 * 60));
    }
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    addRowToHistoryTable(kills, assists, points, drones, aerodinahui, heliPoint, _2500, nuke, killPoints);
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
    updateChartsFromTable();
    remake = false;
}

function lostMake() {
    realKills = parseInt(document.getElementById("killsLost").value) || 0;
    killPoints = parseFloat(document.getElementById("pointsLost").value) || 0;
    startTime = Date.now();
    endCount = realKills + killPoints;
    document.getElementById("totalCount").textContent = `${realKills} (${killPoints}) {${endCount}}`;
    drawPieChart(realKills, killPoints);
}


function drawPieChart(realKills, killPoints) {
    let c = killCount - realKills - killPoints;
    if (c < 0) {
        c = 0;
    }
    const data = google.visualization.arrayToDataTable([['Тип', 'Количество'], ['Остаток', c], ['Киллы', realKills], ['Фраго-очки', killPoints],]);
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
    const dataArray = [['Номер подсчета', 'Фраго-Очки', {role: 'tooltip', type: 'string', p: {html: true}}]];
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
        legend: {position: 'bottom'},
        chartArea: {width: '80%', height: '70%'},
        vAxis: {minValue: 0},
        tooltip: {isHtml: true}
    };

    const chart = new google.visualization.LineChart(document.getElementById('line-chart'));
    chart.draw(data, options);
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


const inputData = document.querySelectorAll('.calc-start, .calc-input, .calc-lost');
inputData.forEach(input => {
    input.addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]*/g, '');
    });
});

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
        <td><button class="edit-btn">Редактировать</button></td>
    `;

    tableBody.appendChild(newRow);
}

document.querySelector("#history-table tbody").addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-btn")) {
        const row = e.target.closest("tr");
        if (e.target.textContent === "Редактировать") {
            for (let i = 1; i <= 8; i++) {
                const currentText = row.cells[i].textContent.trim();
                if (i === 7 || i === 8) {
                    row.cells[i].innerHTML = `
                        <select>
                            <option value="Да" ${currentText === "Да" ? "selected" : ""}>Да</option>
                            <option value="Нет" ${currentText === "Нет" ? "selected" : ""}>Нет</option>
                        </select>`;
                } else {
                    row.cells[i].innerHTML = `<input type="number" value="${currentText}" style="width: 60px;">`;
                }
            }
            e.target.textContent = "Сохранить";
        } else if (e.target.textContent === "Сохранить") {
            let fragCount = parseInt(row.cells[1].querySelector("input").value) || 0;
            let assistCount = parseInt(row.cells[2].querySelector("input").value) || 0;
            let pointCount = parseInt(row.cells[3].querySelector("input").value) || 0;
            let droneCount = parseInt(row.cells[4].querySelector("input").value) || 0;
            let aerodinahuiCount = parseInt(row.cells[5].querySelector("input").value) || 0;
            let heliPointCount = parseInt(row.cells[6].querySelector("input").value) || 0;
            let is2500 = row.cells[7].querySelector("select").value === "Да" ? 4 : 0;
            let isNuke = row.cells[8].querySelector("select").value === "Да" ? 4 : 0;
            let totalPoints = aerodinahuiCount + (0.25 * assistCount) + 0.5 * (pointCount + droneCount) + (2 * heliPointCount) + is2500 + isNuke;
            row.cells[1].textContent = fragCount;
            row.cells[2].textContent = assistCount;
            row.cells[3].textContent = pointCount;
            row.cells[4].textContent = droneCount;
            row.cells[5].textContent = aerodinahuiCount;
            row.cells[6].textContent = heliPointCount;
            row.cells[7].textContent = is2500 ? "Да" : "Нет";
            row.cells[8].textContent = isNuke ? "Да" : "Нет";
            row.cells[9].textContent = totalPoints.toFixed(2);
            e.target.textContent = "Редактировать";
            updateChartsFromTable();
        }
    }
});

function updateChartsFromTable() {
    realKills = 0;
    killPoints = 0;
    endCount = 0;
    progressHistory = [];
    const tableBody = document.querySelector("#history-table tbody");
    const rows = tableBody.querySelectorAll('tr');
    let index = 1;
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 10) {
            const fragCount = parseInt(cells[1].textContent) || 0;
            const assistCount = parseInt(cells[2].textContent) || 0;
            const pointCount = parseInt(cells[3].textContent) || 0;
            const droneCount = parseInt(cells[4].textContent) || 0;
            const aerodinahuiCount = parseInt(cells[5].textContent) || 0;
            const heliPointCount = parseInt(cells[6].textContent) || 0;
            const is2500 = cells[7].textContent.trim() === "Да" ? 4 : 0;
            const isNuke = cells[8].textContent.trim() === "Да" ? 4 : 0;
            const totalPoints = aerodinahuiCount + (0.25 * assistCount) + (0.5 * (pointCount + droneCount)) + (2 * heliPointCount) + is2500 + isNuke;
            realKills += fragCount;
            killPoints += totalPoints;
            endCount = realKills + killPoints;
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            progressHistory.push([index, endCount, timeString]);
            index++;
        }
    });
    document.getElementById("totalCount").textContent = `${realKills} (${killPoints}) {${endCount}}`;
    drawPieChart(realKills, killPoints);
    drawLineChart(progressHistory);
}
