const teamInput = document.getElementById('team-name-input');
const teamAddButton = document.getElementById('add-team-btn');
const teamBoard = document.getElementById('team-board');
const teamList = document.getElementById('team-list');
const teamGroupInput = document.getElementById('team-name');
const groupSelect = document.getElementById('group-select');
const addToGroupButton = document.getElementById('add-to-group-btn');
const groupAList = document.getElementById('groupA');
const groupBList = document.getElementById('groupB');
const delTeamInGroup = document.getElementById('del-team-in-group');
const matchTeamOne = document.getElementById("match-team1");
const matchTeamTwo = document.getElementById("match-team2");
const matchSchedulerButton = document.getElementById("schedule-match-btn");
const matchDateInput = document.getElementById("match-date");
const matchlist = document.getElementById("match-board").querySelector('#match-list');
const resultInputPopUp = document.getElementById("pop-up-form");
const resultInput = document.getElementById("result-input");
const teamOneScore = document.getElementById("team1-score");
const teamTwoScore = document.getElementById("team2-score");
const teamOneOver = document.getElementById("team1-overs");
const teamTwoOver = document.getElementById("team2-overs");




let teams = JSON.parse(localStorage.getItem('teams')) || [];
let groups = JSON.parse(localStorage.getItem('groups')) || {A: [], B: []};
let matches = JSON.parse(localStorage.getItem('matches')) || [];


document.addEventListener('DOMContentLoaded', () => {
    renderTeams();
    teamGroupName();
    renderGroups();
    matchTeamGetter ();
    renderMatches();
});

addToGroupButton.addEventListener('click', addTeamToGroup);

matchSchedulerButton.addEventListener('click', matchScheduler);

matchlist.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON' && e.target.id === 'delete-match'){
        const matchId = e.target.className;
        deleteMatch(matchId);
    }
    renderMatches();


    if(e.target.tagName === 'BUTTON' && e.target.id === 'result-input'){
        const matchId = e.target.className;
        const match = matches.find((match) => match.id === matchId);
        inputMachResult(match);
    }
});

groupAList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const teamName = e.target.className; 
        deleteFromGroup('A', teamName);
        renderGroups();
    }
});

// Event delegation for Group B List
groupBList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const teamName = e.target.className;
        deleteFromGroup('B', teamName); 
        renderGroups(); 
    }
});

//Team input
teamAddButton.addEventListener('click', () => {
    const teamName = teamInput.value.trim();
    const team = {
        id: generateUniqueId(),
        name: teamName,
        group: "", 
        matches: 0, 
        wins: 0, 
        losses: 0,
        draws: 0, 
        points: 0,
        nrr: 0,
        nr: 0,
        totalRunsScored: 0,
        totalOversBowled: 0,
        totalRunsConceded: 0,
        totalOversFaced: 0
    };
    if(!teamName){
        alert("Team Name Cannot Be Empty");
    }else if(teams.includes(team.name)){
        alert("Team Already Exists");
    }else{
        teams.push(team);
        localStorage.setItem("teams", JSON.stringify(teams));
        teamInput.value = "";
        renderTeams();
        teamGroupName();
        matchTeamGetter();
    }
});

//Render Teams
function renderTeams(){
    teamBoard.innerHTML = '';
    teams.forEach((team) => {
        const teamDiv = `
            <div class="team">
                <p>${team.name}</p>
                <button id="del-team" class="${team.name}">Delete</button>
            </div>
            `
        teamBoard.innerHTML += teamDiv;
     
        
    });
}


//Delete Team
teamBoard.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON' && e.target.id === 'del-team'){
        const teamName = e.target.className;
        const team = teams.find((team) => team.name === teamName);
        deleteFromGroup(team.group, teamName);
        teams = teams.filter((team) => team.name !== teamName);
        localStorage.setItem("teams", JSON.stringify(teams));
        renderTeams();
        teamGroupName();
        matchTeamGetter();
        renderGroups();
        
    }
});

// Net run rate calculator
// function calculateNRR(targetteam) {
//     const totalRunsScored = targetteam.totalRunsScored;
//     const totalRunsConceded = targetteam.totalRunsConceded;
//     const totalOversBowled = targetteam.totalOversBowled;
//     const totalOversFaced = targetteam.totalOversFaced;

//     let nrr = ((totalRunsScored / totalOversBowled) - (totalRunsConceded / totalOversFaced));
//     nrr = Math.round(nrr * 10000) / 10000;
//     const team = teams.find((team) => team.name === targetteam.name);
//     team.nrr = nrr;
//     localStorage.setItem("teams", JSON.stringify(teams));
// }
function calculateNRR(targetteam) {
    const totalRunsScored = targetteam.totalRunsScored;
    const totalRunsConceded = targetteam.totalRunsConceded;
    const totalOversBowled = targetteam.totalOversBowled;
    const totalOversFaced = targetteam.totalOversFaced;


    if (totalOversBowled > 0 && totalOversFaced > 0) {

        let nrr = ((totalRunsScored / totalOversFaced) - (totalRunsConceded / totalOversBowled));

        nrr = Math.round(nrr * 10000) / 10000;

        const team = teams.find((team) => team.name === targetteam.name);
        
        if (team) {
            team.nrr = nrr;
        }
        localStorage.setItem("teams", JSON.stringify(teams));

    } else {
        console.warn(`Invalid data for team ${targetteam.name}: overs should be greater than zero`);
    }

}


//Group Input
function teamGroupName(){
    teamGroupInput.innerHTML = "";
    teams.forEach((team) => {
        const option = `
            <option value="${team.name}">${team.name}</option>
        `;
        teamGroupInput.innerHTML += option;
    });
}


//Add to Group
function addTeamToGroup() {
    const teamName = teamGroupInput.value;
    const group = groupSelect.value;
    const team = teams.find((team) => team.name === teamName);

    if (!teamName) {
        alert("Please Select A Team");
    } else if (!group) {
        alert("Please Select A Group");
    } else if (team.group) {
        alert("Team Already In A Group");
    } else {
        if (groups[group].includes(teamName)) {
            alert("Team Already In Group");
        } else {
            // Add team to the group
            groups[group].push(teamName);
            team.group = group;

            // Update localStorage
            localStorage.setItem("teams", JSON.stringify(teams));
            localStorage.setItem("groups", JSON.stringify(groups));
            renderGroups();
        }
    }
}

// Groups renderer
function renderGroups() {
    groupAList.innerHTML = "";
    groupBList.innerHTML = "";

    groups.A.forEach((teamName) => {
        const row = `
            <tr>
                <td>${teamName}</td>
                <td><button id="del-team" class="${teamName}">Delete</button></td>
            </tr>
        `;
        groupAList.innerHTML += row;
    });

    groups.B.forEach((teamName) => {
        const row = `
            <tr>
                <td>${teamName}</td>
                <td><button id="del-team" class="${teamName}">Delete</button></td>
            </tr>
        `;
        groupBList.innerHTML += row;
    });
}

// Delete From Group
function deleteFromGroup(groupName, teamName) {
    if (groupName && groups[groupName]) {
        groups[groupName] = groups[groupName].filter((team) => team !== teamName);
    }
    // Clear the group for the team
    const team = teams.find((team) => team.name === teamName);
    if (team) {
        team.group = "";
    }
    localStorage.setItem("groups", JSON.stringify(groups));
    localStorage.setItem("teams", JSON.stringify(teams));
}

//Match Teams
function matchTeamGetter (){
    matchTeamOne.innerHTML = "";
    matchTeamTwo.innerHTML = "";
    teams.forEach((team)=>{
        const option = `
            <option value= "${team.name}">${team.name}</option>
        `;
        matchTeamOne.innerHTML += option;
        matchTeamTwo.innerHTML += option;
    })    
}
//Get Group
function getGroup(teamName){
    if(groups.A.includes(teamName)){
        return "A";
    }else if(groups.B.includes(teamName)){
        return "B";
    }else{
        return "No Group";
    }

}


//Match Scheduler
function matchScheduler(){
    const team1 = matchTeamOne.value;
    const team2 = matchTeamTwo.value;
    const matchDate = matchDateInput.value;
    const match = {teamOne: team1, teamTwo: team2, Date:matchDate, result:{}, id: generateUniqueId()};
    if(team1 === team2){
        alert("Teams Cannot Be The Same");
    }else if(!team1 || !team2 || !matchDate){
        alert(`Please Fill All Fields`);

    }else if(matches.some((match) => match.teamOne === team1 && match.teamTwo === team2)){
        alert(`Match Already Scheduled`);
    }else if(getGroup(team1) !== getGroup(team2)){
        alert(`Teams Must Belong To The Same Group`);

    }
    else{
        matches.push(match);
        localStorage.setItem("matches", JSON.stringify(matches));
        alert(`Match successfully scheduled between ${team1} and ${team2} on ${matchDate}`);
    }
    renderMatches();

}
//Match unique ID generator
function generateUniqueId() {
    return 'xxxx-xxxx-4xxx-yxxx-xxxxxx'.replace(/[xy]/g, (char) => {
        const random = (Math.random() * 16) | 0;
        const value = char === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
}


//Match Renderer
function renderMatches(){
    matchlist.innerHTML = "";
    matches.forEach((mach)=>{
        const matchDiv = `
             <tr>
                <td>${mach.teamOne}</td>
                <td>${mach.teamTwo}</td>
                <td>${mach.Date}</td>
                <td><button id="delete-match" class="${mach.id}">Delete</button></td>
                <td><button id="result-input" class="${mach.id}">Result</button></td>
            </tr>
        `;
        matchlist.innerHTML += matchDiv;
    })
}
//Match Deleter
function deleteMatch(matchId){
    matches = matches.filter((match) => match.id !== matchId);
    localStorage.setItem('matches', JSON.stringify(matches));
    renderMatches();
}
// Match result inputer
function inputMachResult(match) {
    // Show the pop-up form
    resultInputPopUp.style.display = "block";

    // Listen for result submission
    resultInputPopUp.querySelector('button').addEventListener('click', () => {
        const teamOneScoreValue = teamOneScore.value.trim();
        const teamTwoScoreValue = teamTwoScore.value.trim();
        const teamOneOverValue = teamOneOver.value.trim();
        const teamTwoOverValue = teamTwoOver.value.trim();
        const matchResult = resultInput.value.trim().toLowerCase(); 

        // Validate the input
        if (!matchResult) {
            alert("Please enter a valid result (team1, team2, or draw).");
            return;
        }

        // Update match result
        match.result = matchResult;

        // Update team statistics based on the result
        const teamOne = teams.find((team) => team.name === match.teamOne);
        const teamTwo = teams.find((team) => team.name === match.teamTwo);

        if (matchResult === "team1") {
            teamOne.wins += 1;
            teamOne.points += 2;
            teamOne.matches += 1;
            teamTwo.matches += 1;
            teamTwo.losses += 1;
        } else if (matchResult === "team2") {
            teamTwo.wins += 1;
            teamOne.matches += 1;
            teamTwo.points += 2;
            teamTwo.matches += 1;
            teamOne.losses += 1;
        } else if (matchResult === "draw") {
            teamOne.draws += 1;
            teamOne.matches += 1;
            teamTwo.points += 1;
            teamOne.points += 1;
            teamTwo.matches += 1;
            teamTwo.draws += 1;
        }else{
            teamOne.nr += 1;
            teamOne.matches += 1;
            teamTwo.matches += 1;
            teamTwo.nr += 1;
        }

        if (teamOneScoreValue && teamTwoScoreValue) {
            teamOne.totalRunsScored += parseInt(teamOneScoreValue);
            teamOne.totalRunsConceded += parseInt(teamTwoScoreValue);
            teamOne.totalOversFaced += parseInt(teamTwoOverValue);
            teamOne.totalOversBowled += parseInt(teamOneOverValue);

            teamTwo.totalRunsScored += parseInt(teamTwoScoreValue);
            teamTwo.totalRunsConceded += parseInt(teamOneScoreValue);
            teamTwo.totalOversFaced += parseInt(teamOneOverValue);
            teamTwo.totalOversBowled += parseInt(teamTwoOverValue);
        }

        // Save updates to local storage
        localStorage.setItem("matches", JSON.stringify(matches));
        localStorage.setItem("teams", JSON.stringify(teams));

        // Hide the pop-up form
        resultInputPopUp.style.display = "none";

        // Re-render matches and teams
        calculateNRR(teamOne);
        calculateNRR(teamTwo);
        renderMatches();
        renderTeams();
    });
}




