import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminView } from "@/drawRanges/AdminView";
import {
  ADMIN_SESSION_EXPIRED_EVENT,
  checkAdminSession,
  InvalidAdminPasswordError,
  loginAdmin,
} from "@/drawRanges/adminApi";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

type AuthState = "checking" | "signed-out" | "signed-in";

export const AdminGate = () => {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onSessionExpired = () => {
      setPassword("");
      setError("Your admin session expired. Please sign in again.");
      setAuthState("signed-out");
    };

    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => {
      window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, onSessionExpired);
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    checkAdminSession()
      .then((isAuthenticated) => {
        if (isCurrent) {
          setAuthState(isAuthenticated ? "signed-in" : "signed-out");
        }
      })
      .catch(() => {
        if (isCurrent) {
          setAuthState("signed-out");
          setError("Could not check your admin session. Try signing in.");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginAdmin(password);
      setPassword("");
      setAuthState("signed-in");
    } catch (error) {
      setError(
        error instanceof InvalidAdminPasswordError
          ? "That password did not match."
          : "Could not sign in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  if (authState === "checking") {
    return (
      <div
        className="flex min-h-[50vh] w-full items-center justify-center"
        role="status"
        aria-label="Checking admin access"
      >
        <LoaderCircle
          className="size-8 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (authState === "signed-out") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <form
          className="flex w-full max-w-sm flex-col gap-4"
          onSubmit={onSubmit}
        >
          <h1 className="text-xl font-semibold">Admin sign in</h1>
          <label
            className="flex flex-col gap-2 text-sm"
            htmlFor="admin-password"
          >
            Password
            <Input
              id="admin-password"
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy || password.length === 0}>
            {busy ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    );
  }

  return <AdminView />;
};
