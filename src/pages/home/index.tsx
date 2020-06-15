import React, { useContext, useState, ChangeEvent } from 'react';
import style from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import { MainStore, Book } from '../../stores/mainStore';
import Layout from '../../components/layout';
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    CardActions,
    Button,
    CardMedia,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    TextField,
    MenuItem
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import chevronRight from '@iconify/icons-mdi/chevron-right';
import { useHistory } from "react-router-dom";

const Home = observer(() => {
    const mainStore = useContext(MainStore);
    const historic = useHistory();
    const [orderBy, setOrderBy] = useState<number>();
    const handleOrden = (e: ChangeEvent<HTMLInputElement>) => {
        let aux = parseInt(e.target.value);
        let orderedArray: Book[] = [];
        if (aux === 0) {
            orderedArray = mainStore.booksSortByAlfabeticalOrder;
            mainStore.filterByCategory(orderedArray);
        } else if (aux === 1) {
            orderedArray = mainStore.booksSortByReverseAlfabeticalOrder;
            mainStore.filterByCategory(orderedArray);
        } else if (aux === 2) {
            orderedArray = mainStore.booksSortByCreationDate;
            mainStore.filterByCategory(orderedArray);
        } else if (aux === 3) {
            orderedArray = mainStore.booksSortByReverseCreationDate;
            mainStore.filterByCategory(orderedArray);
        }
        setOrderBy(aux);
    }
    const goToCategory = (id: number) => {
        historic.push(`/category-view/${id}`)
    }
    const goToBook = (id: number) => {
        historic.push(`/visualizar-livro/${id}`)
    }
    return (
        <Layout title="Livraria" initialTab={0}>
            <div className={style.container}>
                <div className={style.ordeanarDiv}>
                    <TextField
                        select
                        fullWidth
                        variant="filled"
                        label="Ordenar"
                        onChange={handleOrden}
                        value={orderBy}
                    >
                        <MenuItem value={0}>
                            Ordem afalbetica A-Z
                        </MenuItem>
                        <MenuItem value={1}>
                            Ordem afalbetica Z-A
                        </MenuItem>
                        <MenuItem value={2}>
                            Mais recentes
                        </MenuItem>
                        <MenuItem value={3}>
                            Mais Antigos
                        </MenuItem>
                    </TextField>
                </div>
                <div>
                    <ListItem button onClick={() => { goToCategory(0) }}>
                        <ListItemText primary="Sem categoria" />
                        <ListItemSecondaryAction >
                            <IconButton onClick={() => { goToCategory(0) }} >
                                <Icon icon={chevronRight} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <div className={style.itemsContainer}>
                        {mainStore.homeBooks.noCategory.map(book => (
                            <Card className={style.card}>
                                <CardActionArea onClick={() => { goToBook(book.id) }}>
                                    <CardMedia
                                        className={style.mediaCard}
                                        image="https://images.pexels.com/photos/34592/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                        title="Sample book image"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {book.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {book.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button onClick={() => { goToBook(book.id) }} className="text-transform-none" size="small" color="primary">
                                        + Informações
                                </Button>
                                    <Button onClick={() => {
                                        mainStore.deleteBook(book.id)
                                    }} className="text-transform-none" size="small" color="primary">
                                        - Deletar
                                </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </div>
                </div>
                <div>
                    <ListItem button onClick={() => { goToCategory(1) }}>
                        <ListItemText primary="Lendo" />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => { goToCategory(1) }}>
                                <Icon icon={chevronRight} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <div className={style.itemsContainer}>
                        {mainStore.homeBooks.reading.map(book => (
                            <Card className={style.card}>
                                <CardActionArea onClick={() => { goToBook(book.id) }}>
                                    <CardMedia
                                        className={style.mediaCard}
                                        image="https://images.pexels.com/photos/34592/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                        title="Sample book image"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {book.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {book.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button onClick={() => { goToBook(book.id) }} className="text-transform-none" size="small" color="primary">
                                        + Informações
                                    </Button>
                                    <Button onClick={() => {
                                        mainStore.deleteBook(book.id)
                                    }} className="text-transform-none" size="small" color="primary">
                                        - Deletar
                                </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </div>
                </div>
                <div>
                    <ListItem button>
                        <ListItemText primary="Quero ler" onClick={() => { goToCategory(2) }} />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => { goToCategory(2) }}>
                                <Icon icon={chevronRight} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <div className={style.itemsContainer}>
                        {mainStore.homeBooks.wantToRead.map(book => (
                            <Card className={style.card}>
                                <CardActionArea onClick={() => { goToBook(book.id) }}>
                                    <CardMedia
                                        className={style.mediaCard}
                                        image="https://images.pexels.com/photos/34592/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                        title="Sample book image"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {book.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {book.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button onClick={() => { goToBook(book.id) }} className="text-transform-none" size="small" color="primary">
                                        + Informações
                                </Button>
                                    <Button onClick={() => {
                                        mainStore.deleteBook(book.id)
                                    }} className="text-transform-none" size="small" color="primary">
                                        - Deletar
                                </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </div>
                </div>
                <div>
                    <ListItem button onClick={() => { goToCategory(2) }}>
                        <ListItemText primary="Lido" />
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => { goToCategory(2) }}>
                                <Icon icon={chevronRight} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <div className={style.itemsContainer}>
                        {mainStore.homeBooks.read.map(book => (
                            <Card className={style.card}>
                                <CardActionArea onClick={() => { goToBook(book.id) }}>
                                    <CardMedia
                                        className={style.mediaCard}
                                        image="https://images.pexels.com/photos/34592/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                                        title="Sample book image"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {book.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {book.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button onClick={() => { goToBook(book.id) }} className="text-transform-none" size="small" color="primary">
                                        + Informações
                                    </Button>
                                    <Button onClick={() => {
                                        mainStore.deleteBook(book.id)
                                    }} className="text-transform-none" size="small" color="primary">
                                        - Deletar
                                </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
});

export default Home;
