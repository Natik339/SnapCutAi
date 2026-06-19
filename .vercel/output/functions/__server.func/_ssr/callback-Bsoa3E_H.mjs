import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./router-BsP_EZBf.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-DQ5v2DYb.mjs";
import { L as Logo } from "./Logo-CQWWpRYe.mjs";
import { n as LoaderCircle, C as CircleCheck, a as CircleAlert } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
function AuthCallbackPage() {
  const [status, setStatus] = reactExports.useState("loading");
  const [message, setMessage] = reactExports.useState("");
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const {
          data: {
            session
          },
          error
        } = await supabase.auth.getSession();
        console.log("[AuthCallback] getSession", {
          session,
          error
        });
        if (error) {
          console.error("Auth callback error:", error);
          setStatus("error");
          setMessage(error.message || "Failed to verify email");
          return;
        }
        if (session) {
          setStatus("success");
          setMessage("Email confirmed successfully!");
          window.location.replace("/");
        } else {
          setStatus("error");
          setMessage("No valid session found");
        }
      } catch (err) {
        console.error("Callback error:", err);
        setStatus("error");
        setMessage("Something went wrong");
      }
    };
    handleAuthCallback();
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "h-12 w-12" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: status === "loading" ? "Verifying Email..." : status === "success" ? "Email Confirmed!" : "Verification Failed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-8", children: [
      status === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-16 w-16 text-cyan-400 animate-spin" }),
      status === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-16 w-16 text-green-500 mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 text-center", children: "Redirecting you to the home page in a moment..." })
      ] }),
      status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-16 w-16 text-red-500 mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 text-center mb-2", children: "Please try again or return to the login page" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
            to: "/login"
          }), className: "text-cyan-400 hover:underline font-medium", children: "Go to Login" })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  AuthCallbackPage as component
};
