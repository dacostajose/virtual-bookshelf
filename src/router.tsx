import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/home";
import AddBook from "./pages/addBook";
import CategoryView from "./pages/category";
import BookView from "./pages/bookView";


export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/adicionar-livro" component={AddBook} />
                <Route path="/category-view/:categoryId" component={CategoryView} />
                <Route path="/visualizar-livro/:bookId" component={BookView} />
            </Switch>
        </BrowserRouter>
    );
}