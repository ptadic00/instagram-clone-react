import React, {useState} from 'react'
import {Button} from "@material-ui/core"
import {db, storage} from './firebase'
import firebase from "firebase";
import './ImageUpload.css';

function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] =useState(null);
    const [progress, setProgress] =useState(0);
    const [upload, setUpload]=useState(false);

    const handleChange = (e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
            setUpload(true);
        }
    }

    const handleUpload = ()=>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            //progress function
            "state_changed",
            (snapshot) =>{
                const progress=Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },

            (error) =>{
                //error message
                console.log(error);
                alert(error.message);
            },
            ()=>{
                //complete function
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    //post image inside url
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    });
                    //kad se sve zavrsi vracamo se na pocetak
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                });
            }
        );
    };

    return (
        <div className="imageupload">
            <progress className="progress" value={progress} max="100"/>
            <input className="imageupload__caption" type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input className="imageupload__file" type="file" onChange={handleChange}/>
            {upload ? (
                <Button className="uploadButton" onClick={handleUpload}>Upload</Button>
                ): (
                    <div></div>
                )}
        </div>
    )
}

export default ImageUpload
