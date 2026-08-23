import React from "react";
import ReactDOM from "react-dom/client";
import { LazyMotion, domAnimation } from "framer-motion";
import App from "./App.tsx";
import "./index.css";

// LazyMotion + the `m` component (used throughout, instead of `motion`)
// loads only the animation features actually used here (opacity/transform/
// stagger via domAnimation) instead of framer-motion's full feature set,
// which meaningfully cuts the JS bundle shipped on first load.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>
);
