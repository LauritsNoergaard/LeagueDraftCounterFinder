import { PriorityQueue } from "./priorityQueue.js";

window.addEventListener("load", start);

const allChampionNames = ["Aatrox", "Ahri", "Akali", "Akshan", "Alistar", "Ambessa", "Amumu", "Anivia", "Annie", "Aphelios", "Ashe",
  "Aurelion Sol", "Aurora", "Azir", "Bard", "Bel'Veth", "Blitzcrank", "Brand", "Braum", "Briar", "Caitlyn", "Camille", "Cassiopeia",
  "Cho'Gath", "Corki", "Darius", "Diana", "Dr. Mundo", "Draven", "Ekko", "Elise", "Evelynn", "Ezreal",
  "Fiddlesticks", "Fiora", "Fizz", "Galio", "Gangplank", "Garen", "Gnar", "Gragas", "Graves", "Gwen",
  "Hecarim", "Heimerdinger", "Hwei", "Illaoi", "Irelia", "Ivern", "Janna", "Jarvan IV", "Jax", "Jayce", "Jhin",
  "Jinx", "Kai'Sa", "Kalista", "Karma", "Karthus", "Kassadin", "Katarina", "Kayle", "Kayn", "Kennen",
  "Kha'Zix", "Kindred", "Kled", "Kog'Maw", "LeBlanc", "Lee Sin", "Leona", "Lillia", "Lissandra", "Lucian",
  "Lulu", "Lux", "Malphite", "Malzahar", "Maokai", "Master Yi", "Milio", "Miss Fortune", "Mordekaiser", "Morgana", "Naafiri", "Nami",
  "Nasus", "Nautilus", "Neeko", "Nidalee", "Nilah", "Nocturne", "Nunu & Willump", "Olaf", "Orianna", "Ornn",
  "Pantheon", "Poppy", "Pyke", "Qiyana", "Quinn", "Rakan", "Rammus", "Rek'Sai", "Rell", "Renata Glasc",
  "Renekton", "Rengar", "Riven", "Rumble", "Ryze", "Samira", "Sejuani", "Senna", "Seraphine", "Sett",
  "Shaco", "Shen", "Shyvana", "Singed", "Sion", "Sivir", "Skarner", "Smolder", "Sona", "Soraka", "Swain",
  "Sylas", "Syndra", "Tahm Kench", "Taliyah", "Talon", "Taric", "Teemo", "Thresh", "Tristana", "Trundle",
  "Tryndamere", "Twisted Fate", "Twitch", "Udyr", "Urgot", "Varus", "Vayne", "Veigar", "Vel'Koz", "Vex",
  "Vi", "Viego", "Viktor", "Vladimir", "Volibear", "Warwick", "Wukong", "Xayah", "Xerath", "Xin Zhao",
  "Yasuo", "Yone", "Yorick", "Yuumi", "Zac", "Zed", "Zeri", "Ziggs", "Zilean", "Zoe",
  "Zyra"];

let allChampions = [];
let allComps = [];

let enemyTeam =[];

function displayChampions(comp) {

    if (comp === "noTeam") {
        document.getElementById("champ" + (1)).innerHTML = "No team found";
        return null;
    }
    // This should be the returned team from the "TESTworkWithChosenChamps" function
    //let comp = Object.keys(allComps)[0];
    const team = comp.team;
    
    for (let i = 0; i < 5; i++) {
        let champ = team[i];
        document.getElementById("champ" + (i+1)).innerHTML = champ;
    }
}

//Display graph
function displayGraph(graph) { //Graph most likely not needed
    //todo: Potentially get the element circle div?
    const svgNamespace = "http://www.w3.org/2000/svg";

    //const totalNodes = 56;
    const columns = 10;
    const nodeSpacing = 100;

    const svg = document.createElementNS(svgNamespace, "svg");
    //^^EXPLAIN THIS LINE OF CODE
    
    const circlePositions = {}; //Storage for when lines between nodes need to be drawn
    let circleIndex = 0;

    for (let comp in allComps) {  //Graph here instead of allComps??  
        const x = 50 + (circleIndex % columns) * nodeSpacing;
        const y = 50 + Math.floor(circleIndex/columns) * nodeSpacing;

        circlePositions[comp] = {x, y};

        const circle = document.createElementNS(svgNamespace, "circle");

        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("id", "circle" + comp);
        circle.classList.add("circles");
        svg.appendChild(circle);

        circleIndex++;
    }

    //Edges
    for (let comp in allComps) {
        const {x: x1, y: y1} = circlePositions[comp];

        graph[comp].forEach((champDiff) => { //fixme: neighborId instead of comp?
            const {x: x2, y: y2} = circlePositions[champDiff];
            const edge = document.createElementNS(svgNamespace, "line");
            edge.setAttribute("x1", x1);
            edge.setAttribute("y1", y1);
            edge.setAttribute("x2", x2);
            edge.setAttribute("y2", y2);
            edge.classList.add("edge");
            svg.appendChild(edge);
        })
    }

    document.getElementById('circle').appendChild(svg);
}

function champOptions() { //User input options
    for (let j = 1; j < 6; j++) {
        const selector = document.getElementById("champSelection" + j);
        for (let i = 0; i < allChampionNames.length; i++) {
            const champion = document.createElement('option');
            champion.value = allChampionNames[i];
            champion.innerHTML = champion.value;
            selector.appendChild(champion);
        }
    }
}


function grabChamps() { //Grab the champions when the button is pushed 
    const graph = makeGraph(allComps);
    const chosenChamps = [];
    for (let i = 1; i < 6; i++) {
        let currChamp = document.getElementById('champSelection' + i).value;
        chosenChamps.push(currChamp)
    }

    enemyTeam = chosenChamps;
    //findBestCounterTeam(enemyTeam);
    findBestCounterTeamWithAStar(enemyTeam, graph);
}

function findBestCounterTeamWithAStar(enemyTeam, graph) {
    //List with possible comps
    let possibleComps = new PriorityQueue();
    let searchedComps = new Set();

    let bestComp = null;
    let highestCounterScore = 0;

    //Initialize the queue with all comps
    for (let comp in allComps) {
        const currComp = allComps[comp];
        const h = counterHeuristic(currComp.counters, enemyTeam);
        //console.log(comp);
        possibleComps.enqueue({id: comp, g: 0, f: h, team: currComp.team, counters: currComp.counters}, -h); // possibleComps.enqueue({currComp}, -h); - TODO: I'M UNSURE ABOUT WHY -h HERE - UNDERSTAND THIS !!!!!
    }

    //Search
    for (let i = 0; i < 79; i++) { //!possibleComps.isEmpty()
        setTimeout(() => {
            //document.getElementById("comp" + (i+1)).classList.add("selected");

            const curr = possibleComps.dequeue();

            //Marking the visual circle as searched
            const circle = document.getElementById("circle" + curr.id);

            circle.setAttribute("fill", "darkcyan");

            if (!curr) {
                console.warn("No more possible comps");
                return;
            }

            //Mark as searched
            searchedComps.add(curr.id); //fixme: Does it have to be . something? Like curr.team/id?

            const counterScore = counterHeuristic(curr.counters, enemyTeam);

            if (counterScore > highestCounterScore) {
                highestCounterScore = counterScore;
                bestComp = curr;
            }

            if (counterScore === 5) { // 5 when every champ has 1 counter champ, it can never be more than 5. If you add more counter champs then change this number accordingly
                console.log("Found team that counters every champ", curr.team);
                //^^It's possible for more than 1 comp to have 5 counter score, so maybe then you could look at the synergies of the team next? To choose the best of those.
                displayChampions(curr);
                return; //End search as a perfect counter team has been found
            }

            //todo: HAVE THIS EXPLAINED/BE ABLE TO EXPLAIN THIS
            
            for (let nId of graph[curr.id]) {
                if (!searchedComps.has(nId)) {
                    const n = allComps[nId]
                    const g = curr.g + 1;
                    const h = counterHeuristic(n.counters, enemyTeam);
                    const f = g + h;

                    possibleComps.enqueue({id: nId, g, f, team: n.team, counters: n.counters}, -f);
                    console.log(searchedComps);
                } else {
                    console.log("Skip node, already seen it");
                }
            }

            if (i === 78 && bestComp) {
                console.log("No comp counters all, checking unfavoured ones as well to be sure");
                /* for (let comp in allComps) { //fixme: Consider implementing this to make sure all are checked, good in the project but not necesarry for A*
                    if (!searchedComps.has(comp)) {
                        const fallbackNode = allComps[comp];
                        console.log("Processing remaining node:", comp);
                        searchedComps.add(comp);
                        const circleLeft = document.getElementById("circle" + comp);
                        circleLeft.setAttribute("fill", "red");
                        const counterScore = counterHeuristic(fallbackNode.counters, enemyTeam);
                        if (counterScore > highestCounterScore) {
                            highestCounterScore = counterScore;
                            bestComp = { id: comp, team: fallbackNode.team };
                            
                        }
                        displayChampions(bestComp);
                    }
                } */
                console.log("No comp counters all, but here is the best: ", bestComp, "With this score ", highestCounterScore);
                displayChampions(bestComp);
            } /* else {
                //console.log("No comp found");
            }
 */
        }, 100 * i); 
    } 
}

function counterHeuristic(compCounters, enemyTeam) {
    let counterScore = 0;
    for (let champ of enemyTeam) {
        if (compCounters.includes(champ))
            counterScore += 1;
    }
    return counterScore;
}

function makeGraph(allComps) {
    let graph = {};

    for (let comp in allComps) {
        graph[comp] = [];

        for (let comp2 in allComps) {
            if (comp != comp2) {
                const team1 = allComps[comp].team;
                const team2 = allComps[comp2].team;

                let champDifs = 0;
                for (let i = 0; i < 5; i++) {
                    if (team1[i] != team2[i]) champDifs++;
                }

                if (champDifs === 1) {
                    graph[comp].push(comp2);
                }
            }
        }
    }
    return graph;
}

async function compsFromJson() {
    const response = await fetch("champComps.json");
    const data = await response.json();

    allComps = data.allComps;
}

async function start() {
    console.log("Javascript runs");
    await compsFromJson();
    displayGraph(makeGraph(allComps));
    
    champOptions();
    //displayChampions();
    document.getElementById('champSubmitBTN').onclick = grabChamps;
}


/* 
STATUS:
- There's a working site now that picks a good counter comp
- So far it's not A*, there's for instancee no heuristic, it just goes through all comps
- Next step maybe check ChatGPT convos about A* implementation with comps stored? 
Also of course the following is needed:
- More comps (MAKE EACH COMP CHANGE BY 1 CHAMPION AT A TIME FOR THE GRAPH/EDGE REPRESENTATION)
- Visualization
- Actually making it A* search
*/