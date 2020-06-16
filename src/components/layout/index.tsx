import React, { FunctionComponent, useState } from 'react';
import styles from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import { AppBar, Toolbar, Typography, Hidden, BottomNavigation, BottomNavigationAction, IconButton } from "@material-ui/core";
import { Icon } from "@iconify/react";
import homeIcon from '@iconify/icons-mdi/home';
import bookPlusMultipleOutline from '@iconify/icons-mdi/book-plus-multiple-outline';
import chevronLeft from '@iconify/icons-mdi/chevron-left';
import { useHistory } from "react-router-dom";
interface LayoutProps {
    title: string,
    initialTab: number,
    showBackButton?: boolean
}
const Layout: FunctionComponent<LayoutProps> = observer(({ children, title, initialTab, showBackButton }) => {
    const [bottomTabVal, setBottomTabVal] = useState(initialTab);
    const historic = useHistory();

    const goToCreateBook = () => {
        historic.push("/adicionar-livro")
    }

    const goToHome = () => {
        historic.push("/")
    }
    const goBack = () => {
        historic.goBack();
    }
    return (
        <div className={styles.mainContainer}>
            <Hidden xsDown>
                <AppBar position="static" className={styles.appBar}>
                    <Toolbar className={styles.toolBar}>
                        <Typography className={"cursor-pointer"} variant="h6" onClick={goToHome}>
                            {title}
                        </Typography>
                        <div className={styles.actionContainer}>
                            <IconButton onClick={goToCreateBook}>
                                <Icon color="#fff" icon={bookPlusMultipleOutline} />
                            </IconButton>
                        </div>

                    </Toolbar>
                </AppBar>
            </Hidden>
            <Hidden smUp>
                <AppBar position="static" className={styles.mobileAppBar}>
                    <Toolbar>
                        {showBackButton ? (
                            <div className={styles.mobileActionContainer}>
                                <IconButton onClick={goBack}>
                                    <Icon icon={chevronLeft} />
                                </IconButton>
                            </div>
                        ) : ("")}

                        <h3 className={"cursor-pointer"} onClick={goToHome}>
                            {title}
                        </h3>
                    </Toolbar>
                </AppBar>
            </Hidden>
            {children}
            <Hidden smUp>
                <BottomNavigation
                    value={bottomTabVal}
                    onChange={(event, newValue) => {
                        setBottomTabVal(newValue);
                    }}
                    showLabels
                    className={styles.bottomTabnav}
                >
                    <BottomNavigationAction onClick={goToHome} label="Inicio" icon={<Icon icon={homeIcon} />} />
                    <BottomNavigationAction onClick={goToCreateBook} label="Adicionar livro" icon={<Icon icon={bookPlusMultipleOutline} />} />

                </BottomNavigation>

            </Hidden>
        </div>
    );
});

export default Layout;
