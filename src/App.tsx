import { Index, Match, Switch, onCleanup, onMount, } from 'solid-js'
import SnakeBody from './SnakeBody'
import './App.css'
import { createStore, produce } from 'solid-js/store'

const GRID_SIZE = 20
const SPEED = 100

interface ICell {
    x: number
    y: number
}

const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
}

interface IState {
    snake: SnakeBody<ICell>
    board: number[][]
    food: ICell
    score: number
    best_score: number
    direction: keyof typeof directions
}

const init_node: ICell = { x: 7, y: 10 }
const init_food: ICell = { x: 0, y: 0 }

const initial_state: IState = {
    snake: new SnakeBody({ value: init_node }),
    board: [...new Array(GRID_SIZE)].map(() => new Array(GRID_SIZE).fill(0)),
    direction: "right",
    food: init_food,
    score: 0,
    best_score: 0
}


enum CellType {
    Empty = 0,
    Snake = 1,
    Food = 2
}

function App() {
    const [state, setState] = createStore(initial_state)

    onMount(() => {
        generateSnake()
        generateFood()

        document.addEventListener("keyup", changeDirection)

        if (!localStorage.getItem("pbs")) {
            localStorage.setItem("pbs", '0')
        } else {
            setState("best_score", parseInt(localStorage.getItem("pbs")!))
        }

        // TODO: implement timer
        setInterval(() => {
            moveSnake(state)
        }, SPEED)
    })

    onCleanup(() => {
        document.removeEventListener("keyup", changeDirection)
    })

    function restart(): void {
        setState("snake", new SnakeBody({ value: init_node }))
        setState("board", [...new Array(GRID_SIZE)].map(() =>
            new Array(GRID_SIZE).fill(0)
        ))
        setState("food", init_food)
        setState("direction", "right")
        if (state.score > parseInt(localStorage.getItem("pbs")!)) {
            localStorage.setItem("pbs", state.score.toString())
            setState("best_score", state.score)
        }
        setState("score", 0)

        generateSnake()
        generateFood()
    }

    function moveSnake(state: IState): void {
        const head = state.snake.first()?.value as ICell
        const tail = state.snake.last()?.value as ICell

        const new_head = {
            x: head.x + directions[state.direction].x,
            y: head.y + directions[state.direction].y
        }

        const new_tail = {
            x: tail.x + directions[state.direction].x,
            y: tail.y + directions[state.direction].y
        }

        if (new_head.x < 0
            || new_head.x >= GRID_SIZE
            || new_head.y < 0
            || new_head.y >= GRID_SIZE
            || state.board[new_head.x][new_head.y] === CellType.Snake) {
            // alert("Game over")

            restart()
            return
        }

        setState(produce((curr_state) => {
            if (curr_state.board[new_head.x][new_head.y] === CellType.Food) {
                curr_state.score += 1
                curr_state.snake.append(new_tail)
                generateFood()
            }
            else {
                curr_state.board[tail.x][tail.y] = CellType.Empty
            }

            curr_state.snake.prepend(new_head)
            curr_state.snake.pop()
            curr_state.board[new_head.x][new_head.y] = CellType.Snake
        }))
    }

    function generateSnake(): void {
        const snake_head = state.snake.first()?.value as ICell
        setState("board", [snake_head.x], [snake_head.y], CellType.Snake)
    }

    function generateFood(): void {
        const food = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        }

        if (state.board[food.x][food.y] === CellType.Snake) {
            generateFood()
            return
        }

        setState("board", [food.x], [food.y], CellType.Food)
    }

    function changeDirection(keyUp: KeyboardEvent): void {
        const curr_direction = state.direction
        let new_direction = curr_direction
        switch (keyUp.code) {
            case "KeyW":
            case "ArrowUp":
                if (curr_direction !== "down")
                    new_direction = "up"
                break
            case "KeyA":
            case "ArrowLeft":
                if (curr_direction !== "right")
                    new_direction = "left"
                break
            case "KeyS":
            case "ArrowDown":
                if (curr_direction !== "up")
                    new_direction = "down"
                break
            case "KeyD":
            case "ArrowRight":
                if (curr_direction !== "left")
                    new_direction = "right"
                break
            default:
                return
        }

        if (new_direction === curr_direction)
            return

        setState("direction", new_direction)
    }

    return (
        <main>
            <h1>Solid Snake</h1>
            <div class="score">Score: {state.score}</div>
            <div class="score">Best: {state.best_score}</div>
            <Index each={state.board}>
                {i =>
                    <div class="grid-cell">
                        <Index each={i()}>
                            {j =>
                                <Switch>
                                    <Match when={j() === CellType.Snake}>
                                        <div class="grid-cell-inner green" />
                                    </Match>
                                    <Match when={j() === CellType.Food}>
                                        <div class="grid-cell-inner red" />
                                    </Match>
                                    <Match when={j() === 0}>
                                        <div class="grid-cell-inner" />
                                    </Match>
                                </Switch>
                            }
                        </Index>
                    </div>
                }
            </Index>
        </main>
    )
}

export default App
