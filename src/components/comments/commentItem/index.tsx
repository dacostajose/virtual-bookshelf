import React, { useContext, useState, FunctionComponent, MouseEvent } from 'react';
import style from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import { MainStore, Comment } from "../../../stores/mainStore";
import {
    IconButton, ListItem, ListItemAvatar, Avatar, Divider, ListItemText, ListItemSecondaryAction, Menu, MenuItem
} from '@material-ui/core';
// npm install --save-dev @iconify/react @iconify/icons-mdi
import { Icon } from '@iconify/react';
import dotsVertical from '@iconify/icons-mdi/dots-vertical';

interface CommentItemProps {
    comment: Comment,
    editFunction: Function;
}

const CommentItem: FunctionComponent<CommentItemProps> = observer(({ comment, editFunction }) => {
    const mainStore = useContext(MainStore);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    const formateDate = (date: number) => {
        let data = new Date(date);
        return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()} às ${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`
    }
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleDelete = () => {
        mainStore.deleteComment(comment.id, comment.parentId);
        handleClose();
    }
    const hadleEdit = () => {
        editFunction()
        handleClose();
    }
    return (
        <>
            <ListItem className={style.listItem}>
                <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src="https://source.unsplash.com/600x600/?dog" />
                </ListItemAvatar>
                <ListItemText
                    primary={comment.author}
                    secondary={<>
                        {formateDate(comment.timestamp)}
                        <br />{comment.body}
                    </>}
                />
                <ListItemSecondaryAction>
                    <IconButton aria-controls={`menu-edit${comment.id}`} aria-haspopup="true" onClick={handleClick}>
                        <Icon icon={dotsVertical} />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Menu
                id={`menu-edit${comment.id}`}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => { handleClose() }}
            >
                <MenuItem onClick={() => { hadleEdit() }}>Editar</MenuItem>
                <MenuItem onClick={() => { handleDelete() }}>Excluir</MenuItem>
            </Menu>
            <Divider variant="inset" component="li" />
        </>
    );
});

export default CommentItem;
