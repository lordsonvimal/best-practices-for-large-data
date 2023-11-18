import "./App.scss";

import { Component, createSignal } from "solid-js";

const MODES = ["large"] as const;

type Mode = typeof MODES[number];

const DEFAULT_VALUES = {
  large: Math.pow(2, 53).toString()
};

type Operator = "+" | "-" | "*" | "/";

function toFloat(val: string) {
  return parseFloat(val);
}

const add = (a: string, b: string) => `${toFloat(a) + toFloat(b)}`;
const sub = (a: string, b: string) => `${toFloat(a) - toFloat(b)}`;
const mul = (a: string, b: string) => `${toFloat(a) * toFloat(b)}`;
const div = (a: string, b: string) => `${toFloat(a) / toFloat(b)}`;

const bigAdd = (a: string, b: string) => {
  const result = BigInt(toFloat(a)) + BigInt(toFloat(b));
  return result.toString();
};

const OPERATORS: Record<Operator, (a: string, b: string) => string> = {
  "+": add,
  "-": sub,
  "*": mul,
  "/": div
};

const App: Component = () => {
  const [mode, setMode] = createSignal<Mode | null>(null);
  const [operand1, setOperand1] = createSignal("");
  const [operator, setOperator] = createSignal<Operator | null>(null);
  const [operand2, setOperand2] = createSignal<string>("");
  
  const changeMode = (mode: Mode) => {
    setMode(mode);
    setOperand1(DEFAULT_VALUES[mode]);
    setOperand2("");
    setOperator(null);
  };

  const display = () => {
    return `${operand1()}${operator() || ""}${operand2()}`;
  };

  const changeOperator = (op: Operator) => {
    if (operand1() && operator() && operand2()) {
      setOperand1(OPERATORS[operator() as Operator](operand1(), operand2()));
      setOperand2("");
    }

    setOperator(op);
  };

  const addNumber = (num: string) => {
    if (operator()) {
      if (operand2()) {
        setOperand2(operand2() + num);
      } else {
        setOperand2(num);
      }
      return;
    }

    if (operand1()) {
      setOperand1(operand1() + num);
    } else {
      setOperand1(num);
    }
  };

  const calculate = () => {
    if (operator() && operand2()) {
      setOperand1(OPERATORS[operator() as Operator](operand1(), operand2()));
    }
    setOperator(null);
    setOperand2("");
  };

  const reset = () => {
    setMode(null);
    setOperand1("");
    setOperand2("");
    setOperator(null);
  }

  return (
    <>
      <main class="calculator">
        <div class="calculator-display">{display()}</div>
        <button class="calculator-op" onClick={reset}>AC</button>
        <button class="calculator-num" onClick={[addNumber, "1"]}>1</button>
        <button class="calculator-num" onClick={[addNumber, "2"]}>2</button>
        <button class="calculator-op" onClick={[changeOperator, "/"]}>/</button>
        <button class="calculator-num" onClick={[addNumber, "3"]}>3</button>
        <button class="calculator-num" onClick={[addNumber, "4"]}>4</button>
        <button class="calculator-num" onClick={[addNumber, "5"]}>5</button>
        <button class="calculator-op" onClick={[changeOperator, "-"]}>-</button>
        <button class="calculator-num" onClick={[addNumber, "6"]}>6</button>
        <button class="calculator-num" onClick={[addNumber, "7"]}>7</button>
        <button class="calculator-num" onClick={[addNumber, "8"]}>8</button>
        <button class="calculator-op" onClick={[changeOperator, "*"]}>*</button>
        <button class="calculator-num" onClick={[addNumber, "9"]}>9</button>
        <button class="calculator-num" onClick={[addNumber, "0"]}>0</button>
        <button class="calculator-op" onClick={[changeOperator, "+"]}>+</button>
        <button class="calculator-op" onClick={calculate}>=</button>
      </main>
      <header>
        <button classList={{"btn-data-selector": true, "btn-selected": mode() === MODES[0]}} onClick={[changeMode, MODES[0]]}>Large number</button>
      </header>
    </>
  );
};

export default App;
