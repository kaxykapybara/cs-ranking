const STORAGE_KEY = "swiss_pickems";

function createSwiss(data){

const bracket =
document.getElementById("bracket");

bracket.innerHTML = `

<div class="swiss">

<div class="column">

<h3>0:0</h3>

${openingMatches(data.matches)}

</div>

<div class="column">

<h3>1:0</h3>

${placeholderMatches(4)}

<h3 style="margin-top:30px;">0:1</h3>

${placeholderMatches(4)}

</div>

<div class="column">

<h3>2:0</h3>

${placeholderMatches(2)}

<h3 style="margin-top:30px;">1:1</h3>

${placeholderMatches(4)}

<h3 style="margin-top:30px;">0:2</h3>

${placeholderMatches(2)}

</div>

<div class="column">

<h3>3:0</h3>

${recordSlots(2)}

<h3 style="margin-top:30px;">2:1</h3>

${placeholderMatches(2)}

<h3 style="margin-top:30px;">1:2</h3>

${placeholderMatches(2)}

<h3 style="margin-top:30px;">0:3</h3>

${recordSlots(2)}

</div>

<div class="column">

<h3>3:1</h3>

${recordSlots(3)}

<h3 style="margin-top:30px;">2:2</h3>

${placeholderMatches(3)}

<h3 style="margin-top:30px;">1:3</h3>

${recordSlots(3)}

</div>

<div class="column">

<h3>3:2</h3>

${recordSlots(3)}

<h3 style="margin-top:30px;">2:3</h3>

${recordSlots(3)}

</div>

</div>

`;

}

function openingMatches(matches){

return matches.map(match=>`

<div class="match">

<div class="team">

<img
src="logos/${teamMeta[match.team1].logo}"
class="team-logo">

${teamMeta[match.team1].fullname}

</div>

<div class="team">

<img
src="logos/${teamMeta[match.team2].logo}"
class="team-logo">

${teamMeta[match.team2].fullname}

</div>

</div>

`).join("");

}

function placeholderMatches(amount){

let html = "";

for(let i=0;i<amount;i++){

html += `

<div class="match">

<div class="team placeholder">?</div>

<div class="team placeholder">?</div>

</div>

`;

}

return html;

}

function recordSlots(amount){

let html = "";

for(let i=0;i<amount;i++){

html += `

<div class="record-slot">

?</div>

`;

}

return html;

}