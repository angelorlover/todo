import { batch, createEffect, createSignal} from "solid-js";
import {render} from "solid-js/web";
import { createStore} from "solid-js/store";

const Todo = () => {

    const createLocalStore = (name, init) => {
        const localState = localStorage.getItem(name);
        const [state, setState] = createStore(localState ? JSON.parse(localState) : init);
        createEffect(() => localStorage.setItem(name, JSON.stringify(state)));
        return [state, setState];
    }

    const removeIndex = (array, index) => {
        return [...array.slice(0, index), ...array.slice(index+1)];
    }

    const [newTitle, setTitle] = createSignal("");
    const [todos, setTodos] = createLocalStore("todos", []);

    const addTodo = (e) => {
        e.preventDefault();
        batch(
            () => {
                setTodos(todos.length, {
                    title: newTitle(),
                    done: false,
                });
                setTitle("");
            }
        );
    };

    return (
        <>
            <h3>Todos</h3>
            <form onSubmit={addTodo}>
                <input
                    placeholder="input here +"
                    required
                    value={newTitle()}
                    onInput={(e) => setTitle(e.currentTarget.value)}
                />
                <button>+</button>
            </form>
            <For each={todos}>
                {
                    (todo, i) =>
                    (
                        <div>
                            <input
                            type="checkbox"
                            checked={todo.done}
                            onChange={(e) => setTodos(i(), "done", e.currentTarget.checked)}
                            />
                            <input
                            type="text"
                            value={todo.title}
                            onChange={(e) => setTodos(i(), "title", e.currentTarget.value)}
                            />
                            <button onClick={() => setTodos((t) => removeIndex(t, i()))}>
                            X
                            </button>
                        </div>
                        
                    )
                }
            </For>    
        </>
    );
};

export default Todo;