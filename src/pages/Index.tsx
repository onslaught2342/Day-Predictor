import { useState } from "react";
import Preloader from "@/components/Preloader";
import DayPredictor from "@/components/DayPredictor";

const Index = () => {
  const [ready, setReady] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {!ready && <Preloader onDone={() => setReady(true)} />}

      {ready && <DayPredictor />}
    </div>
  );
};

export default Index;
