import { Router } from 'express'
import { getStats } from '../controllers/task.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(requireAuth)
router.get('/stats', asyncHandler(getStats))

export default router
