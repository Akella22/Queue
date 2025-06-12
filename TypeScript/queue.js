'use strict';

class QueueNode {
  #buffer;
  #size;
  #readIndex;
  #writeIndex;
  #length;
  #next;

  constructor({ size }) {
    if (typeof size !== 'number' || size <= 0) {
      throw new Error('QueueNode: `size` must be a positive number.');
    }
    this.#size = size;
    this.#buffer = new Array(size);
    this.#readIndex = 0;
    this.#writeIndex = 0;
    this.#length = 0;
    this.#next = null;
  }

  get length() {
    return this.#length;
  }

  get size() {
    return this.#size;
  }

  get next() {
    return this.#next;
  }

  set next(node) {
    this.#next = node;
  }

  enqueue(item) {
    if (this.#writeIndex >= this.#size) {
      return false;
    }
    this.#buffer[this.#writeIndex++] = item;
    this.#length++;
    return true;
  }

  dequeue() {
    if (this.#length === 0) {
      return null;
    }
    const item = this.#buffer[this.#readIndex];
    this.#buffer[this.#readIndex] = null;
    this.#readIndex++;
    this.#length--;

    if (this.#length === 0) {
      this.#readIndex = 0;
      this.#writeIndex = 0;
    }
    return item;
  }

  peek() {
    if (this.#length === 0) return null;
    return this.#buffer[this.#readIndex];
  }
}

class UnrolledQueue {
  #length = 0;
  #nodeSize;
  #head;
  #tail;

  constructor(options = {}) {
    this.#nodeSize = options.nodeSize || 2048;

    if (typeof this.#nodeSize !== 'number' || this.#nodeSize <= 0) {
        throw new Error('UnrolledQueue: `nodeSize` must be a positive number.');
    }

    const initialNode = new QueueNode({ size: this.#nodeSize });
    this.#head = initialNode;
    this.#tail = initialNode;
  }

  get length() {
    return this.#length;
  }

  enqueue(item) {
    if (!this.#head.enqueue(item)) {
      const newNode = new QueueNode({ size: this.#nodeSize });
      this.#head.next = newNode;
      this.#head = newNode;
      this.#head.enqueue(item);
    }
    this.#length++;
  }

  dequeue() {
    if (this.#length === 0) {
      return null;
    }

    const item = this.#tail.dequeue();
    this.#length--;

    if (this.#tail.length === 0 && this.#tail.next !== null) {
      this.#tail = this.#tail.next;
    }

    return item;
  }

  isEmpty() {
    return this.#length === 0;
  }

  peek() {
    if (this.#length === 0) {
      return null;
    }
    return this.#tail.peek();
  }

  clear() {
    const initialNode = new QueueNode({ size: this.#nodeSize });
    this.#head = initialNode;
    this.#tail = initialNode;
    this.#length = 0;
  }

  *[Symbol.iterator]() {
    let currentNode = this.#tail;
    while (currentNode) {
      for (let i = currentNode.readIndex; i < currentNode.writeIndex; i++) {
        yield currentNode.buffer[i];
      }
      currentNode = currentNode.next;
    }
  }
}

module.exports = { UnrolledQueue };