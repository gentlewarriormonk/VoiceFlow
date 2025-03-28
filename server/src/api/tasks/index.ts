import { Router } from 'express';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../../controllers/tasks';

const router = Router();

/**
 * @route GET /api/tasks
 * @desc Get all tasks
 * @access Public
 */
router.get('/', getTasks);

/**
 * @route GET /api/tasks/:id
 * @desc Get task by ID
 * @access Public
 */
router.get('/:id', getTaskById);

/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Public
 */
router.post('/', createTask);

/**
 * @route PUT /api/tasks/:id
 * @desc Update a task
 * @access Public
 */
router.put('/:id', updateTask);

/**
 * @route DELETE /api/tasks/:id
 * @desc Delete a task
 * @access Public
 */
router.delete('/:id', deleteTask);

export const tasksRoutes = router;
