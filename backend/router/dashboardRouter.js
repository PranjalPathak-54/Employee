import { Router } from 'express'
import { getDashboard } from '../controllers/dashboardController.js'
import { protect } from '../middleware/protect.js'

const dashboardRouter = Router()

dashboardRouter.get('/', protect, getDashboard)
dashboardRouter.post('/', protect, getDashboard)

export default dashboardRouter;