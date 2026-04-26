
import { Router } from "express";
import {register,verifyEmail, login ,getMe} from "../controllers/auth.controller.js";
import{authUser} from "../middleware/auth.middleware.js";
import {registerValidation , loginValidation} from "../validators/auth.validator.js";
import { auth } from "googleapis/build/src/apis/abusiveexperiencereport/index.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, register);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", loginValidation, login);
authRouter.get("/get-me" ,authUser, getMe);
export default authRouter;
