const Book = require('../models/Book');

const bookController = {
    // GET /livros
    getBooks: async (req, res) => {
        try {
            const books = await Book.find().sort({ createdAt: -1 });
            res.json(books);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar livros', erro: error.message });
        }
    },

    // GET /livros/:id
    getBookById: async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) return res.status(404).json({ mensagem: 'Livro não encontrado' });
            res.json(book);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar livro', erro: error.message });
        }
    },

    // POST /livros
    createBook: async (req, res) => {
        try {
            const { titulo, autor, ano, preco } = req.body;

            // Validação básica
            if (!titulo || !autor) {
                return res.status(400).json({ mensagem: 'Título e autor são obrigatórios' });
            }

            const newBook = new Book({
                titulo,
                autor,
                ano: ano || null,
                preco: preco || 0
            });

            await newBook.save();
            res.status(201).json(newBook);
        } catch (error) {
            console.error('Erro ao criar livro:', error);
            res.status(400).json({ mensagem: 'Erro ao criar livro', erro: error.message });
        }
    },

    // PUT /livros/:id
    updateBook: async (req, res) => {
        try {
            const { titulo, autor, ano, preco } = req.body;

            const updatedBook = await Book.findByIdAndUpdate(
                req.params.id,
                { titulo, autor, ano, preco, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );

            if (!updatedBook) {
                return res.status(404).json({ mensagem: 'Livro não encontrado' });
            }

            res.json(updatedBook);
        } catch (error) {
            console.error('Erro ao atualizar livro:', error);
            res.status(400).json({ mensagem: 'Erro ao atualizar livro', erro: error.message });
        }
    },

    // DELETE /livros/:id
    deleteBook: async (req, res) => {
        try {
            const deletedBook = await Book.findByIdAndDelete(req.params.id);
            if (!deletedBook) {
                return res.status(404).json({ mensagem: 'Livro não encontrado' });
            }
            res.json({ mensagem: 'Livro deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            res.status(500).json({ mensagem: 'Erro ao deletar livro', erro: error.message });
        }
    }
};

module.exports = bookController;