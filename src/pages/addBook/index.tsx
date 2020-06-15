import React, { useContext, useState, FormEvent, useEffect } from 'react';
import style from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import { MainStore, Book } from '../../stores/mainStore';
import Layout from '../../components/layout';
import { TextField, MenuItem, Button } from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';

const AddBook = observer(() => {
    const location = useLocation();
    const historic = useHistory();
    const mainStore = useContext(MainStore);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [editing, setEditing] = useState(false);
    const [book, setBook] = useState<Book>()
    useEffect(() => {
        loadingEditing()
    }, [mainStore.books])
    const loadingEditing = () => {
        let query = new URLSearchParams(location.search);
        let editing = query.get("editing") === "true" ? true : false;
        if (editing) {
            const bookId = query.get("bookId");
            if (bookId) {
                setEditing(true);
                const bookEd = mainStore.getBookById(parseInt(bookId));
                if (bookEd) {
                    setBook(bookEd)
                    setTitle(bookEd.title);
                    setDescription(bookEd.description);
                    setCategory(bookEd.category);
                    setAuthor(bookEd.author);
                }

            }
        }
    }
    const cleanStates = () => {
        setTitle("");
        setDescription("");
        setAuthor("");
        setCategory("");
    }
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!editing) {
            const data = {
                title: title.trim(),
                description,
                author,
                category
            }
            mainStore.addBook(data);
            cleanStates()
        } else {
            let bookEd = book;
            if (bookEd) {
                bookEd.title = title;
                bookEd.category = category;
                bookEd.description = description;
                bookEd.author = author;
                mainStore.editBook(bookEd);
                historic.goBack();
            }
        }
    }
    return (
        <Layout title="Adicionar livro" initialTab={1} showBackButton>
            <form className={style.bookForm} onSubmit={handleSubmit}>
                <h3>
                    Cadastrar novo livro
                </h3>
                <TextField
                    className={style.textField}
                    variant="filled"
                    label="Título"
                    required
                    value={title}
                    onChange={(e) => { setTitle(e.target.value) }}
                />
                <TextField
                    className={style.textField}
                    variant="filled"
                    label="Autor"
                    required
                    value={author}
                    onChange={(e) => { setAuthor(e.target.value) }}
                />
                <TextField
                    className={style.textField}
                    variant="filled"
                    label="Categoria"
                    select
                    required
                    value={category}
                    onChange={(e) => { setCategory(e.target.value) }}
                >
                    {
                        mainStore.categories.map(cate => (
                            <MenuItem key={cate} value={cate}>
                                {
                                    cate === "reading" ? "Lendo" :
                                        cate === "wantToRead" ? "Quero ler" :
                                            cate === "read" ? "Lido" : "Sem Categoria"
                                }
                            </MenuItem>))
                    }

                </TextField>
                <TextField
                    className={style.textField}
                    variant="filled"
                    label="Descrição"
                    multiline
                    rowsMax={4}
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => { setDescription(e.target.value) }}
                />

                <Button variant="contained" color="primary" type="submit">
                    Adicionar livro
                </Button>
            </form>
        </Layout>
    );
});

export default AddBook;
