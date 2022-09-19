import { createEffect, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { render } from "solid-js/web";
import _ from "lodash";

const Dogadog = () => {

    const createLocalStore = (name, init) => {
        const localState = localStorage.getItem(name);
        const [state, setState] = createStore(localState ? JSON.parse(localState) : init);
        createEffect(() => localStorage.setItem(name, JSON.stringify(state)));
        return [state, setState];
    }

    const removeIndex = (array, index) => {
        return [...array.slice(0, index), ...array.slice(index + 1)];
    }

    const dogArray = ['🐶', '🐻', '🐼',  '🐵', '🐱', '🐹', '🐸', '🐮', '🐷', '🐔', '🐙', '🐠'];

    const [dogs, setDogs] = createLocalStore("dogs", dogArray);
    const [level, setLevel] = createSignal(1);
    const [dogdArea, setDogArea] = createSignal(8 * 8);
    const [comboNum, setComboNum] = createSignal(3);
    const [dogsDepth, setDogsDepth] = createSignal(6);
    const [terminalLvl, setTerminalLvl] = createSignal(100);
    const [isValid, setIsValid] = createSignal(false);

    const size = 25;
    

    const rangeArray = [
        [2, 5],
        [1, 6],
        [1, 7],
        [0, 7],
        [0, 8],
    ];



    const initializingDogs = (lvl) => {

        const curLevel = lvl < terminalLvl() ? lvl : terminalLvl();
        const gapArray = [0, 0, 1/4, -1/4, 1/2, -1/2].slice(0, (curLevel + 1) * 2);
    
        
        const curDogs = _.shuffle(dogArray).slice(0, curLevel*4);
        



        let generateDog = (dog) => {
            
            const gap = gapArray[parseInt(gapArray.length * Math.random())];
            const range = rangeArray[curLevel < 5 ? curLevel-1 : 4];
            const startPointX = parseInt((range[1] - range[0]) * Math.random());
            const startPointY = parseInt((range[1] - range[0]) * Math.random());
            const x = startPointX + gap;
            const y = startPointY + gap;
            return {
                dog,
                x,
                y,
                isValid: false,
                color: 'white',
            }
        
        }

        let totalDogs = [];
        let newCurDogs = _.shuffle(curDogs);
        newCurDogs.forEach((dog) => {
            for (let i = 0; i < (curLevel) * 3; i++) {
                totalDogs.push(generateDog(dog));
            }
        });

        return _.shuffle(totalDogs);

    }

    let totalDogs = initializingDogs(level());

    

    const [todoDogs, setTodoDogs] = createSignal([]);

    
    const isReadonly = (dogs) => {
        // let dogsArray = dogs.slice();
        let dogsArray = dogs;
        let newDogs = dogsArray.map((dog, index) => {
            let curX = dog.x;
            let curY = dog.y;
            let toCompareDogs = dogs.slice(index + 1);
            dog.isValid = !toCompareDogs.some((dog) => {
                return !(dog.x >= curX + 1
                    || dog.x <= curX - 1
                    || dog.y >= curY + 1
                    || dog.y <= curY - 1)
            });
            dog.color = dog.isValid ? '' : '';
            return dog;
        });
        // console.log(newDogs);
        return newDogs;
    }

    const [initalDogs, setInitalDogs] = createStore({ dogs: isReadonly(totalDogs) });
    const [todoList, setTodoList] = createStore({ dogs: [] });

    const pressDogs = (index) => {

        let newtodoList = todoList.dogs.filter((dog) => dog.dog === initalDogs.dogs[index].dog);
        let othertodoList = todoList.dogs.filter((dog) => dog.dog !== initalDogs.dogs[index].dog);
        let addtodoList = newtodoList.length === 2 ? [...othertodoList] : [...todoList.dogs, initalDogs.dogs[index]];
        if (addtodoList.length === 7) {
            console.log("game over");
            reset();
            // alert("游戏结束");
        }
        setTodoList('dogs', (dogs) => {
            return [...addtodoList]
        })

        setInitalDogs('dogs', (dogs) => {
            return [...dogs.slice(0, index), ...dogs.slice(index + 1)];
        });
        setInitalDogs('dogs', (dogs) => {
            return dogs.map((dog, index) => {
                let toCompareDogs = initalDogs.dogs.slice(index + 1);
                let curX = dog.x;
                let curY = dog.y;
                let isValid = !toCompareDogs.some((dog) => {
                    return !(dog.x >= curX + 1
                        || dog.x <= curX - 1
                        || dog.y >= curY + 1
                        || dog.y <= curY - 1)
                });
                let color = dog.isValid ? '' : '';
                return { ...dog, isValid: isValid, color: color };
            })
        });
        // console.log(initalDogs.dogs);

        // render();
        
    }

    const [popDogs, setPopDogs] = createStore({ dogs: [] });

    const pop = () => {
        setPopDogs('dogs', (dogs) => {

            return [...dogs, ...todoList.dogs.slice(0, 3)];
        });
        setTodoList('dogs', (dogs) => {
            return [...dogs.slice(3)];
        });
    }

    const back = () => {
        setInitalDogs('dogs', (dogs) => {
            return [...dogs.slice(0), ...todoList.dogs.slice(-1)];
        });
        
        setTodoList('dogs', (dogs) => {
            return [...dogs.slice(0, -1)];
        });


    }

    const shuffle = () => {
        const curLevel = level() < terminalLvl() ? level() : terminalLvl();
        const gapArray = [0, 0, 1/4, -1/4, 1/2, -1/2].slice(0, (curLevel + 1) * 2);
    
        
        const curDogs = dogArray.slice(0, curLevel * 3);
        



        let generateDog = (dog) => {
            
            const gap = gapArray[parseInt(gapArray.length * Math.random())];
            const range = rangeArray[curLevel < 5 ? curLevel-1 : 4];
            const startPointX = parseInt((range[1] - range[0]) * Math.random());
            const startPointY = parseInt((range[1] - range[0]) * Math.random());
            const x = startPointX + gap;
            const y = startPointY + gap;
            return {
                dog,
                x,
                y,
                isValid: false,
                color: 'white',
            }
        
        }

        let totalDogs = [];
        initalDogs.dogs.forEach((dog) => {
            totalDogs.push(generateDog(dog.dog));
        });

        setInitalDogs('dogs', (dogs) => {
            return [...isReadonly(_.shuffle(totalDogs)).slice(0)];
        });

    }

    const next = () => {
        setLevel(level() + 1);
        setInitalDogs('dogs', (dogs) => {
            return [...isReadonly(initializingDogs(level()))];
        });
    }

    const reset = () => {
        setLevel(0);
        next();
        setPopDogs('dogs', (dogs) => {
            return [];
        });
        setTodoList('dogs', (dogs) => {
            return [];
        });
    }

    createEffect(() => {
        // pressDogs();
        console.log(initalDogs.dogs);
        console.log(todoList.dogs);
        console.log(popDogs.dogs);


    })

    return (
        <>
        
                <For each={initalDogs.dogs}>
                    {
                    (dog, i) => 
                    (
                        
                        <div  style={`border-color: red; border: 1px; position: absolute;top: 100px; left:100px;width:40px; height: 40px;transform: translate(${dog.x * 100}%, ${dog.y * 100}%`}>
                            <button disabled={!dog.isValid} style={`width:40px; height: 40px; background-color: ${dog.color};
                            `}
                                onClick={()=>pressDogs(i())}>{ dog.dog}</button>
                        </div>
                        
                         
                        )
                    }
            </For>
            <div style={`border-color: red; border: 1px; position: absolute;top: 150px; left:10px;`}>
            <ul>
                <For each={popDogs.dogs}>
                    {
                    (dog, i) => 
                    (
                        <div style={`border-color: red; border: 1px; position: absolute;top: 400px; left:${100+i()*40}px;width:40px; height: 40px;`}>
                            <button style={`border: none; width:40px; height: 40px; background-color: ${dog.color};
                            `}
                                onClick={()=>pressDogs(i())}>{ dog.dog}</button>
                         </div>
                        )
                    }
                </For>
            </ul>
            </div>
            <div style={`border-color: red; border: 1px; position: absolute;top: 200px; left:10px;`}>
            <ul>
                <For each={todoList.dogs}>
                    {
                    (dog, i) => 
                    (
                        <div style={`border-color: red; border: 1px; position: absolute;top: 400px; left:${100+i()*40}px;width:40px; height: 40px;`}>
                            <button disabled={!dog.isValid} style={`border: none; width:40px; height: 40px; background-color: ${dog.color};
                            `}
                                onClick={()=>pressDogs(i())}>{ dog.dog}</button>
                         </div>
                        )
                    }
                </For>
            </ul>
            </div>
            <div style={`border-color: red; border: 1px; position: absolute;top: 500px; left:100px;width:40px; height: 40px;`}>
                <button style={`border: none; position: absolute;top: 150px; left:50px;width:40px; height: 40px;`}
                onClick={() => pop()}>弹出</button>
                <button style={`border: none; position: absolute;top: 150px; left:100px;width:40px; height: 40px;`}
                onClick={() => back()}>撤销</button>
                <button style={`border: none; position: absolute;top: 150px; left:150px;width:40px; height: 40px;`}
                onClick={() => shuffle()}>洗牌</button>
                <button style={`border: none; position: absolute;top: 150px; left:200px;width:40px; height: 40px;`}
                onClick={() => next()}>下把</button>
                <button style={`border: none; position: absolute;top: 150px; left:250px;width:40px; height: 40px;`}
                onClick={() => reset()}>重置</button>
            </div>
        </>
    );


};

export default Dogadog;
