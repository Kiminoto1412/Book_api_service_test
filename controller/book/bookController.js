const createError = require("../../utils/createError");
const {
  Book,
  Author,
  Customer,
  Product,
  ProductOption,
  sequelize,
} = require("../../models");

exports.addBook = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, genre, authorName, gender } = req.body;

    let book = await Book.findOne({
      where: {
        name,
      },
    });

    if (!book) {
      book = await Book.create(
        {
          name,
          genre,
        },
        { transaction: t }
      );
      const author = await Author.create(
        {
          bookId: book.id,
          name: authorName,
          gender,
        },
        { transaction: t }
      );
    } else {
      createError("This book has been created.", 400);
    }


    await t.commit();
    res.json({ book });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { bookId } = req.params;
    const { name, genre, authorName, gender } = req.body;

    let book = await Book.findOne({
      where: {
        id: bookId,
      },
    });

    if (book) {
      book = await Book.update(
        { name, genre },
        {
          where: {
            id: bookId,
          },
        },
        { transaction: t }
      );
      const author = await Author.update(
        {
          bookId: book.id,
          name: authorName,
          gender,
        },
        {
          where: { bookId },
        },
        { transaction: t }
      );
    } else {
      createError("This book is not found.", 400);
    }

    const updateBook = await Book.findOne({
      where: { id: bookId },
      attributes: ["name", "genre"],
      include: { model: Author, as: "author", attributes: ["name", "gender"] },
    });

    await t.commit();
    res.json({ updateBook });
  } catch (err) {
    next(err);
  }
};

exports.getAllBook = async (req, res, next) => {
  try {
    const result = await Book.findAll({
      attributes: ["name", "genre"],
      include: { model: Author, as: "author", attributes: ["name", "gender"] },
    });

    res.json({ result });
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ where: { id:bookId } });
    if (!book) {
      createError("This book is not found", 400);
    }

    await Book.destroy({ where: { id:bookId } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
