type SNode<T> = {
    value: T
    next?: SNode<T>
    prev?: SNode<T>
}

/** DoubleLinkedList implementation */
export default class SnakeBody<T> {
    private length: number
    private head?: SNode<T>
    private tail?: SNode<T>

    constructor(init_node?: SNode<T>) {
        this.head = this.tail = init_node
        this.length = 1
    }

    /** Add element to the beginning of the list */
    prepend(value: T): void {
        this.length++
        const new_node = { value: value } as SNode<T>
        if (!this.head) {
            this.head = this.tail = new_node
            return
        }

        const current_head = this.head
        this.head = new_node
        this.head.next = current_head
        this.head.next!.prev = this.head
    }

    /** Add element to the end of the list */
    append(value: T): void {
        this.length++
        const new_node = { value: value } as SNode<T>
        if (!this.head) {
            this.head = this.tail = new_node
            return
        }

        const current_tail = this.tail
        this.tail = new_node
        this.tail.prev = current_tail
        this.tail.prev!.next = this.tail
    }

    /** Remove element from the end of the list */
    pop(): void {
        this.length--
        if (!this.tail) {
            return
        }

        const current_tail = this.tail
        this.tail = current_tail.prev
        this.tail!.next = undefined
    }

    /** Get the first element of the list */
    first(): SNode<T> | undefined {
        return this.head
    }

    /** Get the last element of the list */
    last(): SNode<T> | undefined {
        return this.tail
    }

    /** Get the length of the list */
    size(): number {
        return this.length
    }
}
