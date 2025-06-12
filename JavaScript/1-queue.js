'use strict';


const _items = Symbol('items');
const _size = Symbol('size');

class Queue {
  constructor() {

    this[(_items)] = []; 
    this[(_size)] = 0;   
  }


  enqueue(item) {
    
    this[(_items)].push(item);
    this[(_size)]++;
  }

  
  dequeue() {
    if (this[(_size)] === 0) {
      return undefined;
    }
    this[(_size)]--;
    return this[(_items)].shift();
  }

  peek() {
    if (this[(_size)] === 0) {
      return undefined;
    }
    return this[(_items)][0];
  }

  isEmpty() {
    return this[(_size)] === 0;
  }

  length() {
    return this[(_size)];
  }

  clear() {
    this[(_items)] = [];
    this[(_size)] = 0;
  }

  *[Symbol.iterator]() {
    
    for (const item of this[_items]) {
      yield item;
    }
  }

  toArray() {
    return [...this[(_items)]]; 
  }
}

module.exports = Queue;