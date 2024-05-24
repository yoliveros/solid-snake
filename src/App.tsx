import { Index, Match, Switch, onMount, } from 'solid-js'
import SnakeBody from './SnakeBody'
import './App.css'
import { createStore } from 'solid-js/store'

const GRID_SIZE = 20
const SPEED = 200

interface ICell {
    x: number
    y: number
}

interface IState {
    snake: SnakeBody<ICell>
    board: number[][]
    food: ICell
    score: number
}

const init_node: ICell = { x: 7, y: 10 }
const init_food: ICell = { x: 0, y: 0 }

const initial_state: IState = {
    snake: new SnakeBody({ value: init_node }),
    board: [...new Array(GRID_SIZE)].map(() => new Array(GRID_SIZE).fill(0)),
    food: init_food,
    score: 0
}

const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
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

        // TODO: implement timer
        setInterval(() => moveSnake(state, "right"), SPEED)
    })

    function restart(): void {
        setState("snake", new SnakeBody({ value: init_node }))
        setState("board", [...new Array(GRID_SIZE)].map(() =>
            new Array(GRID_SIZE).fill(0)
        ))
        setState("food", init_food)
        setState("score", 0)

        generateSnake()
        generateFood()
    }

    function moveSnake(
        state: IState,
        direction: keyof typeof directions
    ): void {
        const head = state.snake.peek() as ICell
        const new_head = {
            x: head.x + directions[direction].x,
            y: head.y + directions[direction].y
        }
        if (new_head.x < 0
            || new_head.x >= GRID_SIZE
            || new_head.y < 0
            || new_head.y >= GRID_SIZE) {
            // alert("Game over")

            restart()
            return
        }
    }

    function generateSnake(): void {
        const snake_head = state.snake.peek() as ICell
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

    return (
        <>
            <h1>Solid Snake</h1>
            <div class="score">Score: {state.score}</div>
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
        </>
    )
}

export default App
