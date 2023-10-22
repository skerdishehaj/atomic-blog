import { useState } from 'react';

function SlowComponent() {
  // If this is too slow on your maching, reduce the `length`
  const words = Array.from({ length: 100_000 }, () => 'WORD');
  return (
    <ul>
      {words.map((word, i) => (
        <li key={i}>
          {i}: {word}
        </li>
      ))}
    </ul>
  );
}

const Counter = ({ children }) => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Slow counter?!?</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increase: {count}</button>
      {children}
    </div>
  );
};

/*
 ! Optimizations techniques 
 * 1) By setting the SlowComponent as a children prop of the Counter component, the SlowComponent the SlowComponent will be rendered independently from the Counter component. This means that the SlowComponent will not be re-rendered when the Counter component is re-rendered (every count state change).
 */

export default function Test() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Counter>
        <SlowComponent />
      </Counter>
    </div>
  );
}

