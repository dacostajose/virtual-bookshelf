import { observable, decorate, action, computed } from "mobx";
import { createContext } from "react";
/*
    MobX é mais simples que redux e dá uma liberdade maior ao desenvolvedor além de ser bem semelhante ao recoil js
    https://recoiljs.org/
    https://github.com/facebookexperimental/Recoil
    https://twitter.com/mweststrate/status/1261369870152871937
    nesta thread o criador do MobX explica como as duas são abordagens semelhantes para resolver o mesmo problema
    mas o MobX tem a vantagem de não ser fechado apenas para react, então esta Store poderia ser utilizada em projetos para
    Angular (https://github.com/mobxjs/mobx-angular) e Vuejs (https://github.com/mobxjs/mobx-vue) com o mínimo de alterações
    além de ser possível utilizar com Flutter(https://github.com/mobxjs/mobx.dart) alterando o que for necessário para rodar
*/
interface PreBook {
    title: string,
    description: string,
    author: string,
    category: string,
}
export interface Book {
    id: number,
    timestamp: number,
    title: string,
    description: string,
    author: string,
    category: string,
    deleted: boolean,
    [key: string]: any;
}
export interface Comment {
    id: number,
    parentId: number,
    timestamp: number,
    body: string,
    author: string,
    deleted: boolean,
    [key: string]: any;

}
interface HomeBooks {
    reading: Book[],
    wantToRead: Book[],
    read: Book[],
    noCategory: Book[],
    deleted: Book[],
    [key: string]: Book[];

}
class mainStore {
    categories: string[] = ["reading", "wantToRead", "read", "noCategory"];
    books: Book[] = [];
    homeBooks: HomeBooks = {
        reading: [],
        wantToRead: [],
        read: [],
        noCategory: [],
        deleted: [],
    };
    comments: Comment[] = [];
    commentsBook: Comment[] = [];
    generateIdBook(): number {
        let lengthBooks = this.books.length;
        if (lengthBooks === 0) {
            return 0
        } else {
            return this.books[lengthBooks - 1].id + 1
        }
    }
    async loadBooks() {
        let booksString = await localStorage.getItem("books")
        if (booksString) {
            this.books = JSON.parse(booksString ? booksString : "");
        } else {
            this.books = [];
        }

        this.filterByCategory(this.books);
    }
    filterByCategory(aux: Book[]) {
        this.homeBooks.noCategory = [];
        this.homeBooks.deleted = [];
        this.homeBooks.read = [];
        this.homeBooks.reading = [];
        this.homeBooks.wantToRead = [];
        aux.forEach(book => {
            if (book.category === "noCategory" && !book.deleted) {
                this.homeBooks.noCategory.push(book);
            } else if (book.category === "reading" && !book.deleted) {
                this.homeBooks.reading.push(book);
            } else if (book.category === "wantToRead" && !book.deleted) {
                this.homeBooks.wantToRead.push(book);
            } else if (book.category === "read" && !book.deleted) {
                this.homeBooks.read.push(book);
            } else {
                this.homeBooks.deleted.push(book);
            }
        })
    }
    addBook(preBook: PreBook) {
        const data: Book = {
            ...preBook,
            id: this.generateIdBook(),
            timestamp: Date.now(),
            deleted: false
        }
        this.books.push(data);
        this.commitBooks();
    }
    async commitBooks() {
        let booksString = JSON.stringify(this.books);
        await localStorage.setItem("books", booksString);
        this.loadBooks();
    }
    get booksSortByAlfabeticalOrder(): Book[] {
        return this.books.sort((a, b) => {
            let aux1 = a.title;
            let aux2 = b.title;
            return aux1 < aux2 ? -1 : aux1 > aux2 ? 1 : 0;
        });
    }
    get booksSortByReverseAlfabeticalOrder(): Book[] {
        return this.books.sort((a, b) => {
            let aux1 = a.title;
            let aux2 = b.title;
            return aux1 > aux2 ? -1 : aux1 < aux2 ? 1 : 0;
        });
    }
    get booksSortByCreationDate() {
        return this.books.sort((a, b) => {
            let aux1 = a.timestamp;
            let aux2 = b.timestamp;
            return aux1 < aux2 ? -1 : aux1 > aux2 ? 1 : 0;
        });
    }
    get booksSortByReverseCreationDate() {
        return this.books.sort((a, b) => {
            let aux1 = a.timestamp;
            let aux2 = b.timestamp;
            return aux1 < aux2 ? -1 : aux1 > aux2 ? 1 : 0;
        });
    }
    deleteBook(id: number) {
        this.books.forEach(item => {
            if (item.id === id) {
                item.deleted = true
            };
        });
        this.commitBooks()
    }
    getBookById(id: number) {
        let aux = this.books;
        aux = aux.filter(book => { return book.id === id });
        return aux[0]
    }
    editBook(book: Book) {
        this.books.forEach(item => {
            if (item.id === book.id) {
                item = {
                    ...item,
                    ...book
                }
            };
            return item;
        });
        this.commitBooks()
    }
    async loadComments(bookId: number) {
        let commnetsString = await localStorage.getItem("comments")

        if (commnetsString) {
            let comments: Comment[] = JSON.parse(commnetsString ? commnetsString : "");
            this.comments = comments
            comments = comments.filter(comment => {
                return comment.parentId === bookId && !comment.deleted
            })
            comments.sort((a, b) => {
                let aux1 = a.timestamp;
                let aux2 = b.timestamp;
                return aux1 < aux2 ? -1 : aux1 > aux2 ? 1 : 0;
            });
            this.commentsBook = comments
        }
    }
    async commitComments(parentId: number) {
        let commentString = JSON.stringify(this.comments);
        await localStorage.setItem("comments", commentString);
        this.loadComments(parentId);
    }
    generateIdComment(): number {
        let lengthComment = this.comments.length;
        if (lengthComment === 0) {
            return 0
        } else {
            return this.comments[lengthComment - 1].id + 1
        }
    }
    addComment(parentId: number, body: string, author: string) {
        const data: Comment = {
            parentId,
            body,
            author,
            id: this.generateIdComment(),
            timestamp: Date.now(),
            deleted: false
        }
        this.comments.push(data);
        this.commitComments(parentId);
    }
    deleteComment(commentId: number, parentId: number) {
        this.comments.forEach(item => {
            if (item.id === commentId) {
                item.deleted = true;
            };
        });
        this.commitComments(parentId);
    }
    editComment(commentEd: Comment) {

        this.comments.forEach(comment => {
            if (comment.id === commentEd.commentId) {
                comment.author = commentEd.author;
                comment.body = commentEd.body;
            }
            return comment
        });
        this.commitComments(commentEd.parentId);

    }
}

decorate(mainStore, {
    categories: observable,
    books: observable,
    homeBooks: observable,
    comments: observable,
    commentsBook: observable,
    loadBooks: action,
    addBook: action,
    getBookById: action,
    editBook: action,
    deleteComment: action,
    editComment: action,
    booksSortByAlfabeticalOrder: computed,
    booksSortByCreationDate: computed,
    booksSortByReverseAlfabeticalOrder: computed,
    booksSortByReverseCreationDate: computed,
});

export const MainStore = createContext(new mainStore());
