import React, { useContext, useEffect, useState, MouseEvent } from 'react';
import style from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import { MainStore, Book } from '../../stores/mainStore';
import Layout from '../../components/layout';
import {
    IconButton,
    MenuItem,
    Menu,
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import bookOpenPageVariant from '@iconify/icons-mdi/book-open-page-variant';
import notebookCheck from '@iconify/icons-mdi/notebook-check';
import bookSearch from '@iconify/icons-mdi/book-search';
import bookIcon from '@iconify/icons-mdi/book';

import {
    useParams,
    useHistory
} from "react-router-dom";
import CommentsArea from '../../components/comments';

const BookView = observer(() => {
    const mainStore = useContext(MainStore);
    const historic = useHistory();
    const { bookId } = useParams();
    const [book, setBook] = useState<Book>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        setBook(mainStore.getBookById(parseInt(bookId)));
    }, [bookId, mainStore.books])

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (variant?: number) => {
        if (variant || variant === 0) {
            if (book) {
                if (variant >= 0 && variant <= 3) {
                    let newCategory = mainStore.categories[variant];
                    let newBook = book;
                    newBook.category = newCategory
                    mainStore.editBook(newBook);
                    setBook(newBook)

                } else if (variant === 4) {
                    if (book.id) {
                        mainStore.deleteBook(book.id);
                    }
                } else if (variant === 6) {
                    if (book.id) {
                        historic.push(`/adicionar-livro?editing=true&bookId=${book.id}`);
                    }
                }
            }
        }
        setAnchorEl(null);
    };

    const formateDate = (date: number) => {
        let data = new Date(date);
        return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()} às ${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`
    }
    return (
        <>{
            book ? (
                <Layout title={book ? book.title : "Livraria"} initialTab={0} showBackButton>
                    <div className={style.container}>
                        <div className={style.coverImage} />
                        <div className={style.infosContainer}>

                            <div className={style.headingInfos}>
                                <p>
                                    <strong>Adicionado</strong><br />
                                    {formateDate(book.timestamp)}
                                </p>
                                <div className={style.collumButtonDisplay}>
                                    <IconButton aria-controls="menu-edit" aria-haspopup="true" onClick={handleClick}>
                                        {book.category === "read" ? (<Icon icon={notebookCheck} />) :
                                            book.category === "reading" ? (<Icon icon={bookOpenPageVariant} />) :
                                                book.category === "wantToRead" ? (<Icon icon={bookSearch} />) :
                                                    (<Icon icon={bookIcon} />)
                                        }
                                    </IconButton>
                                    <p>
                                        Botão para editar
                                    </p>
                                </div>
                                <Menu
                                    id="menu-edit"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={() => { handleClose(5) }}
                                >
                                    <MenuItem onClick={() => { handleClose(0) }}>Lendo</MenuItem>
                                    <MenuItem onClick={() => { handleClose(1) }}>Quero ler</MenuItem>
                                    <MenuItem onClick={() => { handleClose(2) }}>Lido</MenuItem>
                                    <MenuItem onClick={() => { handleClose(3) }}>Sem Categoria</MenuItem>
                                    <MenuItem onClick={() => { handleClose(4) }}>Deletar</MenuItem>
                                    <MenuItem onClick={() => { handleClose(6) }}>Editar</MenuItem>

                                </Menu>
                            </div>
                            <p className={style.description}>
                                <strong>Autor</strong><br />
                                {book.author}
                            </p>
                            <p className={style.description}>
                                <strong>Descrição</strong><br />
                                {book.description}
                            </p>
                        </div>
                        <CommentsArea bookId={book.id} />
                    </div>
                </Layout >) : (
                    <Layout title={"Livraria"} initialTab={0} showBackButton>
                        <h1>
                            404 not found
                        </h1>
                    </Layout>
                )}
        </>
    );
});

export default BookView;
