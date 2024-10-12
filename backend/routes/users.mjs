import { Router } from 'express';
const router = Router();

import users from "../models/users.mjs";

router.get('/', (req, res) => users.getAll(res, req.query.api_key));
router.get('/:id', (req, res) => users.getUser(
    res,
    req.query.api_key,
    req.params.id
));

export default router;
