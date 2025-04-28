let killCount = 0;
let vehicle = "";

document.getElementById("rememberButton").addEventListener("click", function () {
    killCount = parseInt(document.getElementById("fragNeed").value);
    vehicle = document.getElementById("vehicle").value;
    localStorage.setItem('killCount', killCount);
    localStorage.setItem('vehicle', vehicle);
});
