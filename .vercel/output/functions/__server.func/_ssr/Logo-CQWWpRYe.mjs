import { j as jsxRuntimeExports } from "../_libs/react.mjs";
function Logo({ className = "h-9 w-9" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${className} rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", className: "h-3/5 w-3/5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "logoGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "oklch(0.82 0.14 200)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "oklch(0.65 0.20 260)" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        fill: "white",
        d: "M30 20 Q20 20 20 30 L20 70 Q20 80 30 80 L45 80 L55 70 L70 70 Q80 70 80 60 L80 30 Q80 20 70 20 Z"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "40", cy: "50", r: "8", fill: "url(#logoGrad)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "60", cy: "50", r: "8", fill: "url(#logoGrad)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "55", y: "42", width: "20", height: "16", rx: "4", fill: "url(#logoGrad)" })
  ] }) });
}
export {
  Logo as L
};
