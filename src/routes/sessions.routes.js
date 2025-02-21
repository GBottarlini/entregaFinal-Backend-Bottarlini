import { Router } from "express";
import passport from "passport";
import { login, register, viewLogin, viewRegister, githubLogin } from "../controllers/sessionsController.js";
import { authorization } from "../config/middlewares.js";

const sessionRouter = Router()


sessionRouter.get('/viewlogin', viewLogin)
sessionRouter.get('/viewregister', viewRegister)
sessionRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/login" }), // Usar estrategia "login"
  (req, res) => {
      res.redirect("/"); // Redirige al inicio después del login
  }
);
sessionRouter.post('/register', passport.authenticate('register'), register)
sessionRouter.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res) => {})
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect:'/login'}), githubLogin)
sessionRouter.get("/current", passport.authenticate("current", { session: false }), async (req, res) => { res.send(req.user);});

export default sessionRouter