/* export class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    // Add an item with its priority
    enqueue(item, priority) {
        this.queue.push({ item, priority });
        this.queue.sort((a, b) => a.priority - b.priority); // Sort by priority (lowest first)
    }

    // Remove and return the item with the highest priority (lowest number)
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Cannot dequeue from an empty queue");
        }
        return this.queue.shift().item; // Return only the item
    }

    // Check if the queue is empty
    isEmpty() {
        return this.queue.length === 0;
    }
} */

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