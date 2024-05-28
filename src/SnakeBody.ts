type SNode<T> = {
    value: T
    next?: SNode<T>
}

/** LinkedList implementation */
export default class SnakeBody<T> {
    private length: number
    private head?: SNode<T>
    private tail?: SNode<T>

    constructor(init_node?: SNode<T>) {
        this.head = this.tail = init_node
        this.length = 1
    }

    /** Add element to the beginning of the list */
    append(value: T): void {
        this.length++
        const new_node = { value: value } as SNode<T>
        if (!this.head) {
            this.head = this.tail = new_node
            return
        }

        this.head.next = new_node
        this.head = new_node
    }

    /** Get the first element of the list */
    first(): T | undefined {
        return this.head?.value
    }

    /** Get the last element of the list */
    last(): T | undefined {
        return this.tail?.value
    }

    /** Get the length of the list */
    size(): number {
        return this.length
    }
}
