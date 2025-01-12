const pointsTable = document.getElementById("points-table");
const captureArea = document.getElementById("captureArea");
const exportButton = document.getElementById("exportButton");
const downloadLink = document.getElementById("downloadLink");



let teams = JSON.parse(localStorage.getItem('teams')) || [];

document.addEventListener('DOMContentLoaded', () => {
    pointsRenderer();
});


function pointsRenderer() {
    pointsTable.innerHTML = "";
    teams.forEach((team) => {
        const pointTeam = `
            <tr>
                <td>${team.name}</td>
                <td>${team.matches}</td>
                <td>${team.wins}</td>
                <td>${team.losses}</td> <!-- Fixed 'loses' to 'losses' -->
                <td>${team.nr}</td>
                <td>110</td>
                <td class="positive">+0.262</td>
            </tr>
        `;
        pointsTable.innerHTML += pointTeam; 
    });
}



exportButton.addEventListener("click", () => {
    // Use html2canvas to capture the area
    html2canvas(captureArea).then(canvas => {
        // Convert the canvas to a data URL
        const imageURL = canvas.toDataURL("image/png");

        // Create a link to download the image
        downloadLink.href = imageURL;
        downloadLink.download = "captured-image.png";
        downloadLink.style.display = "block";
        downloadLink.textContent = "Download Image";
    });
});