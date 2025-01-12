const pointsTable = document.getElementById("points-table");

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
