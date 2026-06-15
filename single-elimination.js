const MATCH_WIDTH = 280;
const MATCH_HEIGHT = 120;

const COLUMN_GAP = 120;
const MATCH_GAP = 60;

const STORAGE_KEY = "iem_cologne_2026";

let bracketState = null;

function createSingleElimination(data){

    const teams = data.teams;

    if(!Number.isInteger(Math.log2(teams.length))){
        throw new Error(
            "Single elimination requires 2,4,8,16,32,64... teams"
        );
    }

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if(saved){

        bracketState =
            JSON.parse(saved);

    }else{

        bracketState =
            buildBracket(teams);

    }

    renderBracket();

    const saveBtn =
        document.getElementById(
            "save-picks-btn"
        );

    if(saveBtn){

        saveBtn.onclick = savePicks;

    }
}

function buildBracket(teams){

    const matches = [];

    let currentRound = [];

    for(let i = 0; i < teams.length; i += 2){

        const match = {

            id: matches.length,

            team1: teams[i],
            team2: teams[i+1],

            winner: null,

            nextMatch: null,
            nextSlot: null,

            x: 0,

            y: (i / 2) * (MATCH_HEIGHT + MATCH_GAP)

        };

        currentRound.push(match);
        matches.push(match);
    }

    let round = 1;

    while(currentRound.length > 1){

        const nextRound = [];

        for(let i = 0; i < currentRound.length; i += 2){

            const topMatch =
                currentRound[i];

            const bottomMatch =
                currentRound[i + 1];

            const centerY =
                (
                    topMatch.y +
                    bottomMatch.y
                ) / 2;

            const newMatch = {

                id: matches.length,

                team1: null,
                team2: null,

                winner: null,

                nextMatch: null,
                nextSlot: null,

                x: round *
                    (MATCH_WIDTH + COLUMN_GAP),

                y: centerY

            };

            topMatch.nextMatch =
                newMatch.id;

            topMatch.nextSlot = 0;

            bottomMatch.nextMatch =
                newMatch.id;

            bottomMatch.nextSlot = 1;

            nextRound.push(newMatch);
            matches.push(newMatch);
        }

        currentRound = nextRound;
        round++;
    }

    return {
        teams,
        matches
    };
}

function renderBracket(){

    const bracket =
        document.getElementById("bracket");

    const matches =
        bracketState.matches;

    let maxX = 0;
    let maxY = 0;

    let html = `
    <div class="bracket-canvas">
    `;

    for(const match of matches){

        maxX = Math.max(maxX, match.x);
        maxY = Math.max(maxY, match.y);

        html += `
        <div
            class="match"
            style="
                position:absolute;
                left:${match.x}px;
                top:${match.y}px;
                width:${MATCH_WIDTH}px;
            "
        >

            ${createTeamSlot(match,0)}
            ${createTeamSlot(match,1)}

        </div>
        `;
    }

    html += `
    </div>
    `;

    bracket.innerHTML = html;

    const canvas =
        bracket.querySelector(
            ".bracket-canvas"
        );

    canvas.style.position =
        "relative";

    canvas.style.width =
        (maxX + MATCH_WIDTH + 50)
        + "px";

    canvas.style.height =
        (maxY + MATCH_HEIGHT + 50)
        + "px";
}

function createTeamSlot(
    match,
    slotIndex
){

    const teamName =
        slotIndex === 0
        ? match.team1
        : match.team2;

    if(teamName === null){

        return `
        <div class="team placeholder">
            TBD
        </div>
        `;
    }

    const team =
        teamMeta[teamName];

    const selected =
        match.winner === teamName
        ? "selected"
        : "";

    return `
    <div
        class="team selectable ${selected}"
        onclick="pickWinner(${match.id},'${teamName}')"
    >
        <img
            src="logos/${team.logo}"
            class="team-logo"
        >
        ${team.fullname}
    </div>
    `;
}

function clearPath(matchId, teamName){

    const match =
        bracketState.matches[matchId];

    if(match.team1 === teamName){
        match.team1 = null;
    }

    if(match.team2 === teamName){
        match.team2 = null;
    }

    if(match.winner === teamName){
        match.winner = null;
    }

    if(match.nextMatch !== null){

        clearPath(
            match.nextMatch,
            teamName
        );
    }
}

function pickWinner(
    matchId,
    teamName
){

    const match =
        bracketState.matches[
            matchId
        ];

    if(match.winner === teamName){

        match.winner = null;

        if(match.nextMatch !== null){

            const nextMatch =
                bracketState.matches[
                    match.nextMatch
                ];

            if(match.nextSlot === 0){

                nextMatch.team1 = null;

            }else{

                nextMatch.team2 = null;

            }

            clearPath(
    nextMatch.id,
    match.winner
);
        }

        renderBracket();
        return;
    }

    if(
        match.winner &&
        match.winner !== teamName
    ){

        if(match.nextMatch !== null){

            const nextMatch =
                bracketState.matches[
                    match.nextMatch
                ];

            if(match.nextSlot === 0){

                nextMatch.team1 = null;

            }else{

                nextMatch.team2 = null;

            }

            clearPath(
    nextMatch.id,
    match.winner
);
        }
    }

    match.winner = teamName;

    if(match.nextMatch !== null){

        const nextMatch =
            bracketState.matches[
                match.nextMatch
            ];

        if(match.nextSlot === 0){

            nextMatch.team1 =
                teamName;

        }else{

            nextMatch.team2 =
                teamName;
        }
    }

    renderBracket();
}

function savePicks(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
            bracketState
        )
    );

    const status =
        document.getElementById(
            "save-status"
        );

    if(status){

        status.textContent =
            "Saved!";

        setTimeout(() => {

            status.textContent =
                "";

        }, 2000);
    }
}