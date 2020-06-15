import React, { useContext, useEffect, useState, FunctionComponent } from 'react';
import style from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import { MainStore, Comment } from '../../stores/mainStore';
import {
    List, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@material-ui/core';
import CommentItem from './commentItem';

interface CommentsAreaProps {
    bookId: number
}

const CommentsArea: FunctionComponent<CommentsAreaProps> = observer(({ bookId }) => {
    const mainStore = useContext(MainStore);
    const [openModal, setOpenModal] = useState(false);
    const [authorName, setAuthorName] = useState("");
    const [commentBody, setCommentBody] = useState("");
    const [commentEditing, setCommentEditing] = useState(false);
    const [edComment, setEdComment] = useState<Comment>()

    useEffect(() => {
        mainStore.loadComments(bookId);
    }, []);

    const handleModal = () => {
        setOpenModal(!openModal);
        setAuthorName("");
        setCommentBody("");
    }
    const postComment = () => {
        mainStore.addComment(bookId, commentBody, authorName);
        handleModal();
    }
    const editComment = () => {
        let comment = edComment;
        if (comment) {
            comment.body = commentBody;
            comment.author = authorName;
            mainStore.editComment(comment);
        }
        handleModal();
    }
    const handleEdit = (commentId: number) => {
        setAuthorName(mainStore.comments[commentId].author);
        setCommentBody(mainStore.comments[commentId].body);
        setCommentEditing(true);
        setOpenModal(!openModal);
        setEdComment(mainStore.comments[commentId]);
    }

    return (
        <div className={style.container}>
            <div className={style.headerList}>
                <Button
                    className="text-transform-none"
                    color="primary"
                    variant="outlined"
                    onClick={handleModal}
                >
                    + Adicionar novo comentario
                </Button>
            </div>
            <List>
                {mainStore.commentsBook.map(comment => (
                    <CommentItem key={comment.id} comment={comment} editFunction={() => { handleEdit(comment.id) }} />
                ))}

            </List>
            <Dialog fullScreen open={openModal} onClose={handleModal} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Escreva seu comentario</DialogTitle>
                <DialogContent>
                    <TextField
                        className={style.textField}
                        variant="filled"
                        label="Nome completo"
                        fullWidth
                        value={authorName}
                        onChange={(e) => { setAuthorName(e.target.value) }}
                    />
                    <TextField
                        className={style.textField}
                        variant="filled"
                        label="Comentário"
                        fullWidth
                        multiline
                        rows={4}
                        rowsMax={4}
                        value={commentBody}
                        onChange={(e) => { setCommentBody(e.target.value) }}
                    />
                </DialogContent>
                <DialogActions style={{ justifyContent: "space-between" }}>
                    <Button className="text-transform-none" onClick={handleModal} color="primary">
                        Cancelar
                    </Button>
                    <Button className="text-transform-none" style={{ marginLeft: 20, width: "70%" }} onClick={commentEditing ? editComment : postComment} color="primary" variant="contained">
                        Comentar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
});

export default CommentsArea;
