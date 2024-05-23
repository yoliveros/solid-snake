type SNode<T> = {
    value: T
    next?: SNode<T>
}

/** LinkedList implementation */
export default class SnakeBody<T> {
    private length: number
    private head?: SNode<T>
    private tail?: SNode<T>

    constructor() {
        const init_node = { value: 1 } as SNode<T>
        this.head = this.tail = init_node
        this.length = 1
    }

    /** Add element to the end of the list */
    append(value: T): void {
        this.length++
        const new_node = { value: value } as SNode<T>
        if (!this.head) {
            this.head = this.tail = new_node
            return
        }

        this.tail!.next = new_node
        this.tail = new_node
    }

    /** Get the first element of the list */
    peek(): T | undefined {
        return this.head?.value
    }
}
