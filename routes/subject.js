const express = require('express');
const router = express.Router();

const { SubjectControllers } = require("../controllers/subject/subject.C");

const subjectCtls = new SubjectControllers;

router.get("/:id/:subject", subjectCtls.loadAllProductInSubjectType);
router.post("/:id/:subject", subjectCtls.loadAllProductInSubjectTypePost);
module.exports = router;