import { Router } from 'express'
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from '../controllers/task.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(requireAuth)
router.get('/', asyncHandler(listTasks))
router.get('/:id', asyncHandler(getTask))
router.post('/', asyncHandler(createTask))
router.put('/:id', asyncHandler(updateTask))
router.delete('/:id', asyncHandler(deleteTask))

export default router
