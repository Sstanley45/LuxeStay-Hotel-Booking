import { useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const Loader = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#000");

    return (
    <div style = {{marginTop : '150px'}}>
    <div className="sweet-loading text-center">
      <PulseLoader
        color={color}
        loading={loading}
        size={40}

      />
    </div>
    </div>
  );
};

export default Loader;
