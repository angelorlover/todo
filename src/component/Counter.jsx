import {createSignal, onCleanup} from "solid-js";
import { render } from "solid-js/web";

const Counter = () => {
    const [counter, setCounter] = createSignal(0);
    const action = setInterval(
        () => setCounter(c => c + 1),
        1000
    );
    onCleanup(() => clearInterval(action));
    return (
        <div>
            Counter value is {counter()}
        </div>
    );
};

export default Counter;