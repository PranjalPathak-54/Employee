import { Router } from "express";
import { protect, protectedAdmin } from "../middleware/protect.js";
import { createPayslip, getPayslips, getPayslipsById } from "../controllers/payslipController.js";

const payslipRouter=Router()

payslipRouter.post("/",protect,protectedAdmin,createPayslip)
payslipRouter.get("/",protect,getPayslips)
payslipRouter.get("/:id",protect,getPayslipsById)

export default payslipRouter
