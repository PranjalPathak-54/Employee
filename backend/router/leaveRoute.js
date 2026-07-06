import { Router } from "express";
import { protect, protectedAdmin } from "../middleware/protect.js";
import { createLeave, getLeave, updateLeaveStatus } from "../controllers/leaveApplicationController.js";


const leaveRouter=Router()

leaveRouter.post('/',protect,createLeave)
leaveRouter.get('/',protect,getLeave)
leaveRouter.patch('/:id',protect,protectedAdmin,updateLeaveStatus)

export default leaveRouter