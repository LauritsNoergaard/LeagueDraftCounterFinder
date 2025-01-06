export class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(comp, counters) {
        this.queue.push({comp, counters});
        this.queue.sort(function(a, b){return a.counters - b.counters});
    }

    dequeue() {
        return this.queue.shift().comp;
    }

    isEmpty() {
        console.log(this.queue.length)
        if (this.queue.length === 0) {
            console.log("HEREEEE") 
            return true;
        }  
        else {
            console.log("ELSE STATEMENT")
            return false;
        }
    }
}