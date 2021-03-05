import React, {useState, useEffect} from 'react'
import './App.css';
import Post from './Post'
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 250,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);

  const [posts, setPosts]=useState([]);
  const [open, setOpen] =useState(false);
  const [openSignIn, setOpenSignIn]= useState(false);
  
  const [username, setUsername] =useState('');
  const [password, setPassword] =useState('');
  const [email, setEmail] =useState('');
  const [user, setUser]=useState(null);

  const[show, setShow]=useState(false);

  useEffect(()=>{
   const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //user has logged in...
        console.log(authUser);
        setUser(authUser);

      } else{
        //user has logged out...
        setUser(null);
      }
    })
    return()=>{
      unsubscribe();
    }
  }, [user, username]);

//useEffect runs a piece of code based on a specific condition
  useEffect(()=>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map( doc => ({
        id: doc.id,
        post: doc.data() 
      })));
    }) //every time db changes, "camera" snapshots to update any document
  }, []);


  const signUp =(event) =>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=>alert(error.message))
    
    setOpen(false);
    setShow(false);
  }

  const signIn= (event)=>{
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=>alert(error.message))

    setOpenSignIn(false);
    setShow(false);
  }
  
  return (
    <div className="app">
      <Modal open={open} onClose={()=>setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""/>
            </center>
  	        <Input placeholder="username" type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <Input placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={()=>setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""/>
            </center>
            <Input placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <Button type="submit" onClick={signIn}>Log In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""/>

        {user && !show ?(  
          <AddCircleOutlineIcon className="addButton" onClick={()=>setShow(true)}/>
        ):(
          null
        )}

        {user && show ? 
        <ImageUpload username={user.displayName} /> : null
        } 
      
        {/* {user && user.displayName ?( 
          <ImageUpload username={user.displayName}/>
        ):(
          <h5>You need to Sign Up or Sign In to upload.</h5>
        )} */}

        {user ? (
            <button onClick={()=>auth.signOut()}>Logout</button>
        ): (
            <div className="app__loginContainer">
              <button onClick={()=> setOpenSignIn(true)}>Log In</button> 
              <button onClick={()=> setOpen(true)}>Sign Up</button> 
            </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post})=>(
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
        </div>
        <div className="app__postsRight">
            <InstagramEmbed
              clientAccessToken='490851645653751|53ec0bbcd6719f6c12fd1da2cd3697c3'
              url='https://instagram.com/p/B_uf9dmAGPw/'
              maxWidth={300}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}/>
        </div>
      </div>
    </div>
  );
}

export default App;