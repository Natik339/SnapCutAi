import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-DA2gxxPy.mjs";
import { L as Label, I as Input } from "./label-4pBKAOFV.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-DQ5v2DYb.mjs";
import { u as useAuth } from "./router-BsP_EZBf.mjs";
import { L as Logo } from "./Logo-CQWWpRYe.mjs";
import { C as CircleCheck, a as CircleAlert, M as Mail } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
function getSimpleErrorMessage(err, fallback) {
  if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
    return err.message;
  }
  return fallback;
}
function LoginPage() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = reactExports.useState(false);
  const [isResending, setIsResending] = reactExports.useState(false);
  const [showResentSuccess, setShowResentSuccess] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const navigate = useNavigate();
  const {
    signIn,
    resendConfirmation
  } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsEmailNotConfirmed(false);
    setIsLoading(true);
    try {
      await signIn(email, password);
      navigate({
        to: "/"
      });
    } catch (err) {
      const errorMsg = getSimpleErrorMessage(err, "Failed to sign in");
      if (errorMsg.toLowerCase().includes("email not confirmed") || errorMsg.toLowerCase().includes("email not verified")) {
        setIsEmailNotConfirmed(true);
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendEmail = async () => {
    if (!email) {
      setError("Please enter your email first");
      return;
    }
    setIsResending(true);
    setError(null);
    try {
      await resendConfirmation(email);
      setShowResentSuccess(true);
      setTimeout(() => setShowResentSuccess(false), 5e3);
    } catch (err) {
      setError(getSimpleErrorMessage(err, "Failed to resend email"));
    } finally {
      setIsResending(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-md shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "h-12 w-12" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: "Welcome Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Sign in to your SnapCut AI account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      showResentSuccess ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-green-400 mb-1", children: "Email sent!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-slate-300", children: [
            "A new confirmation email has been sent to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: email })
          ] })
        ] })
      ] }) }) : null,
      isEmailNotConfirmed ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-amber-400 mb-1", children: "Email not confirmed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 mb-3", children: "Please check your email and click the confirmation link." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleResendEmail, disabled: isResending, className: "text-sm text-cyan-400 hover:underline font-medium flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
            isResending ? "Sending..." : "Resend confirmation email"
          ] })
        ] })
      ] }) }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", placeholder: "you@example.com", value: email, onChange: (e) => setEmail(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/forgot-password", className: "text-xs text-cyan-400 hover:underline", children: "Forgot password?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", placeholder: "••••••••", value: password, onChange: (e) => setPassword(e.target.value), disabled: isLoading, required: true })
      ] }),
      error && !isEmailNotConfirmed && !showResentSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-500", children: error }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full bg-gradient-to-r from-cyan-500 to-purple-500", disabled: isLoading, children: isLoading ? "Signing in..." : "Sign In" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-cyan-400 hover:underline", children: "Sign up" })
      ] })
    ] }) })
  ] }) });
}
export {
  LoginPage as component
};
