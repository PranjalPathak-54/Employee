import { Router } from "express";
import { createEmployee, deleteEmployee, getEmployee, updateEmployee } from "../controllers/employeeController.js";
import { protect,protectedAdmin } from "../middleware/protect.js";
const employee=Router();

employee.get("/",protect,protectedAdmin,getEmployee)
employee.post("/",protect,protectedAdmin,createEmployee)
employee.put("/:id",protect,protectedAdmin,updateEmployee)
employee.delete("/:id",protect,protectedAdmin,deleteEmployee)

export default employee