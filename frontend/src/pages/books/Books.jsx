  import { useState, useEffect } from 'react';
  import Sidebar from '../../components/Sidebar';
  import { listarLivros, criarLivro } from '../../api';
  import './Books.scss';

  export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newBook, setNewBook] = useState({
      title: '',
      author: '',
      category: '',
      description: '',
      pdf: null
    });

    const categories = [
      'all',
      'Tecnologia',
      'Programação',
      'Design',
      'Marketing',
      'Negócios',
      'Ciência',
      'Matemática',
      'Literatura',
      'Outros'
    ];



    useEffect(() => {
      loadBooks();
    }, []);

    const loadBooks = async () => {
      try {
        setLoading(true);
        const booksData = await listarLivros(selectedCategory === 'all' ? null : selectedCategory);
        setBooks(booksData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
        setLoading(false);
      }
    };

    const filteredBooks = books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const handleAddBook = async (e) => {
      e.preventDefault();
      try {
        const bookData = {
          titulo: newBook.title,
          autor: newBook.author,
          categoria: newBook.category,
          descricao: newBook.description,
          pdf: newBook.pdf
        };
        await criarLivro(bookData);
        setErrorMessage(''); // Clear any previous error
        setShowAddModal(false);
        setNewBook({
          title: '',
          author: '',
          category: '',
          description: '',
          pdf: null
        });
        loadBooks(); // Reload the books list
      } catch (error) {
        console.error('Erro ao adicionar livro:', error);
        setErrorMessage('Erro ao adicionar livro. Tente novamente.');
      }
    };

    const handleDownloadBook = (book) => {
      // Implementar download do PDF
      console.log('Baixando livro:', book.title);
      // window.open(book.pdfUrl, '_blank');
    };

    const handleViewBook = (book) => {
      // Implementar visualização do PDF
      console.log('Visualizando livro:', book.title);
      // window.open(book.pdfUrl, '_blank');
    };

    return (
      <div className="books-page">
        <Sidebar />
        <main className="books-content">
          <div className="books-header">
            <h1>Livros</h1>
            <button
              className="btn-add-book"
              onClick={() => setShowAddModal(true)}
            >
              + Adicionar Livro
            </button>
          </div>

          <div className="books-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar livros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas as Categorias' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading">Carregando livros...</div>
          ) : (
            <div className="books-grid">
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <div key={book.id} className="book-card">
                    <div className="book-cover">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          onError={(e) => e.target.src = '/default-book-cover.png'}
                        />
                      ) : (
                        <div className="default-cover">
                          <span>{book.title.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="book-info">
                      <h3 className="book-title">{book.title}</h3>
                      <p className="book-author">por {book.author}</p>
                      <span className="book-category">{book.category}</span>
                      <p className="book-description">{book.description}</p>
                    </div>

                    <div className="book-actions">
                      <button
                        className="btn-view"
                        onClick={() => handleViewBook(book)}
                      >
                        Visualizar
                      </button>
                      <button
                        className="btn-download"
                        onClick={() => handleDownloadBook(book)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Nenhum livro encontrado.</p>
                  <p>Adicione o primeiro livro à sua biblioteca!</p>
                </div>
              )}
            </div>
          )}
        </main>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Adicionar Novo Livro</h2>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <form onSubmit={handleAddBook}>
                <input
                  type="text"
                  placeholder="Título do livro"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                />

                <input
                  type="text"
                  placeholder="Autor"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  required
                />

                <select
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <textarea
                  placeholder="Descrição do livro"
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  rows="3"
                />

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setNewBook({ ...newBook, pdf: e.target.files[0] })}
                />



                <div className="modal-buttons">
                  <button type="button" onClick={() => setShowAddModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Adicionar Livro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
