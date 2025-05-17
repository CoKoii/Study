import { useEffect, useState } from "react";

const Son = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(1);
    }, 1000);
    // return () => {
    //   clearInterval(timer);
    // };
  });
  return <div>this is Son</div>;
};

const App = () => {
  const [show, setShow] = useState(true);
  return (
    <div>
      {show && <Son />}
      <button onClick={() => setShow((s) => !s)}>卸载Son组件</button>
    </div>
  );
};
export default App;
