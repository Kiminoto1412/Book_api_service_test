const express = require("express");
const router = express.Router();

const bookController = require('../controller/book/bookController') 

router.get("/",bookController.getAllBook)
router.post("/",bookController.addBook)
router.patch("/:bookId",bookController.updateBook)
router.delete("/:bookId",bookController.deleteBook)

module.exports = router;
