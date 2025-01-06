Screenshot af applikation:
![screenshot af application](https://github.com/LauritsNoergaard/LeagueDraftCounterFinder/blob/main/applicationScreenshot.png?raw=true)

Beskrivelse for “almindelige mennesker”, med hvad der sker i visualiseringen:
Som bruger starter man med at vælge op til 5 karakterer/champions, derefter trykker man på “Generate counter team” knappen, hvilket sætter algoritmen i gang med at lede efter et team, bestående af 5 champions, der er godt imod det bruger-valgte team. 
Der er visualiseret en graf datastruktur, hvor hver cirkel/node er et team bestående af 5 forskellige champions. Hver linje i grafen viser hvilke teams der kun har 1 champion til forskel, det vil sige at hvis en node har en linje over til en anden node, vil det betyde at de to nodes/teams har 4 af de samme champions. 
Efter brugeren har trykket på knappen går algoritmen i gang, hvilket er visualiseret som farveskift i nodes på grafen, hvis en node skifter farve betyder det at algoritmen har kigget på det team. Man kan se at den starter med at kigge på det team som har mindst 1 counter champion. Herefter går den gennem naboerne, som også har mindst 1 counter, og prøver at finde flere potentielt gode teams med flere counters.

Deployede applikation: https://lauritsnoergaard.github.io/LeagueDraftCounterFinder/

Algoritme anvendt: A*

Datastrukturer anvendt: Graph, Priority queue
