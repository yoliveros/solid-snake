import { Index, onMount, } from 'solid-js'
import SnakeBody from './SnakeBody'
import './App.css'
import { createStore } from 'solid-js/store'

const GRID_SIZE = 12

function App() {
    const initial_state = {
        snake: new SnakeBody(),
        board: [...new Array(GRID_SIZE)].map(() => new Array(GRID_SIZE).fill(0)),
    }

    const [state, setState] = createStore(initial_state)

    onMount(() => {
        generateSnake()
    })

    function generateSnake() {
        setState("board", [5], [5], state.snake.peek())
    }

    return (
        <>
            <h1>Solid Snake</h1>
            <Index each={state.board}>
                {i =>
                    <div class="grid-cell">
                        <Index each={i()}>
                            {j => {
                                return <div class={`grid-cell-inner ${j() === 1 ? 'green' : ''}`} >
                                    {j()}
                                </div>
                            }}
                        </Index>
                    </div>
                }
            </Index>
        </>
    )
}

export default App
