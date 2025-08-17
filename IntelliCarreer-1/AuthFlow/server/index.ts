import express, { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";
import path from "path";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// -------------------------
// SESSION SETUP (hardcoded secret)
// -------------------------
app.use(
  session({
    secret: "MySuperSecret123!@#", // hardcoded
    resave: false,
    saveUninitialized: false,
  })
);

// -------------------------
// PASSPORT GOOGLE OAUTH (hardcoded credentials)
// -------------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: "380357188126-8qgtm6iefqi9s1hjp16hvjtedg19mqhn.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://intellicareer-thew.onrender.com/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // You can save user info in DB here if needed
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

// -------------------------
// LOGGING MIDDLEWARE
// -------------------------
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// -------------------------
// GOOGLE AUTH ROUTES
// -------------------------
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

// -------------------------
// ROUTES
// -------------------------
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    const distPath = path.join(__dirname, "public");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = 5000; // hardcoded port
  server.listen(
    { port, host: "0.0.0.0", reusePort: true },
    () => log(`Server running on port ${port}`)
  );
})();
