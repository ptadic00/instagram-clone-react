import React, {useState, useEffect} from 'react'
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import {Button} from "@material-ui/core";
import {db} from './firebase'
import firebase from 'firebase';
import DeleteIcon from '@material-ui/icons/Delete';

function Post({postId, user, username, caption, imageUrl}) {

    const [comments, setComments]  = useState([]);
    const [comment, setComment]  = useState('');
    
    //unsubscribe je varijabla, u bazu ubacujemo i poredamo po timestampu

    useEffect(()=>{
        let unsubscribe;
        if(postId){
            unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>doc.data()));
            });
        }
            
        return()=>{
            unsubscribe();
        };
    }, [postId]);
 
    //dodavanje komentara - kljucna rijec add
    //setComment(''); ?
    const postComment=(event)=>{
        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    const handleDelete = ()=>{
       if(window.confirm("Are you sure you want to delete post?")){
            db.collection("posts").doc(`${postId}`).delete().then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
       }
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar"
                alt={username}
                src="avatar1" />

                <h3>{username}</h3>
                {(user && user.displayName === username) ? (
                    <div className="post__deleteButton">
                        <DeleteIcon onClick={handleDelete}/>
                    </div> 
                ): (
                    <div></div>
                )}
            </div>
            <img className="post__image" src={imageUrl}/> 
            <h4 className="post__text"> <strong>{username}</strong> {caption} </h4>        
            <div className="post__comments">
                {comments.map((comment)=>(
                    <p className="app__comment">
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post__commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                    />

                    <button
                        disabled={!comment}
                        className="post__button"
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}          
        </div>
    )
}

export default Post
