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
import {
    useParams
} from "react-router-dom";
import { useHistory } from "react-router-dom";


const CategoryView = observer(() => {
    const mainStore = useContext(MainStore);
    const [orderBy, setOrderBy] = useState<number>();
    const historic = useHistory();
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
    const { categoryId } = useParams();
    const goToBook = (id: number) => {
        historic.push(`/visualizar-livro/${id}`)
    }
    return (
        <Layout title="Livraria" initialTab={0} showBackButton>
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
                    <ListItem button>
                        <ListItemText primary={
                            mainStore.categories[categoryId] === "reading" ? "Lendo" :
                                mainStore.categories[categoryId] === "wantToRead" ? "Quero ler" :
                                    mainStore.categories[categoryId] === "read" ? "Lido" : "Sem categoria"

                        } />
                        <ListItemSecondaryAction>
                            <IconButton>
                                <Icon icon={chevronRight} />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <div className={style.itemsContainer}>
                        {mainStore.homeBooks[mainStore.categories[categoryId]].map(book => (
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

export default CategoryView;
