const { nanoid } = require("nanoid");
const books = require("./books");

const addBooksHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);

    if (!name) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        }).code(400);
    }

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        insertedAt,
        updatedAt,
        finished
    };

    books.push(newBook);

    return h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
            bookId: id
        }
    }).code(201);
};

const getAllBooksHandler = (request, h) => {
    if (books.length === 0) {
        return {
            status: "success",
            data: {
                books: []
            }
        };
    }

    const formattedBooks = books.map(({id, name, publisher}) => ({
        id,
        name,
        publisher
    }));
    return {
        status: "success",
        data: {
            books: formattedBooks
        }
    };
};


const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find((b) => b.id === bookId);

    if(!book){
        const response = h.response({
            status: "fail",
            message: "Buku tidak ditemukan"
        });
        response.code(404);
        return response;
    }

    return{
        status: "success",
        data: {
            book: book
        }
    };
};

const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if(!name){
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
        response.code(400);
        return response;
    }

    const index = books.findIndex((b) => b.id === bookId);
    if (index === -1) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Id tidak ditemukan"
        });
        response.code(404);
        return response;
    }

    books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString()
    };

    const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui"
    });
    response.code(200);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((b) => b.id === bookId);
    if (index === -1) {
        const response = h.response({
            status: "fail",
            message: "Buku gagal dihapus. Id tidak ditemukan"
        });
        response.code(404);
        return response;
    }

    books.splice(index, 1);

    const response = h.response({
        status: "success",
        message: "Buku berhasil dihapus"
    });
    response.code(200);
    return response;
}


module.exports = {addBooksHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler};