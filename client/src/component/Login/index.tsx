import React, { useState } from 'react';
//import { firebaseLogin, getCurrentUser } from '../../../firebase/auth';
import focusedImage from './assets/btn_google_signin_dark_focus_web.png'
import pressedImage from './assets/btn_google_signin_dark_pressed_web.png'
import normalImage from './assets/btn_google_signin_dark_normal_web.png'
// import { useDispatch } from 'react-redux';
// import { creator_firebaselogin } from '../../redux/firebase.action';

export default (props: { onClickFunction: (event: any) => any }) => {
    //const dispatch = useDispatch();
    const [googleLoginButtonImage, setGoogleLoginButtonImage] = useState(normalImage)
    const changeGoogleLoginButton = (command: "NORMAL" | "FOCUS" | "PRESSED") => {
        switch (command) {
            case "NORMAL": {
                //setGoogleLoginButtonImage("/assets/btn_google_signin_dark_normal_web.png")
                setGoogleLoginButtonImage(normalImage)
                return;
            }
            case "PRESSED": {
                //setGoogleLoginButtonImage("/assets/btn_google_signin_dark_pressed_web.png")
                setGoogleLoginButtonImage(pressedImage)
                return;
            }
            case "FOCUS": {
                //setGoogleLoginButtonImage("/assets/btn_google_signin_dark_focus_web.png")
                setGoogleLoginButtonImage(focusedImage)
                return;
            }
        }
    }
    return (
        <span
            onMouseOver={() => changeGoogleLoginButton("FOCUS")}
            onMouseDown={() => changeGoogleLoginButton("PRESSED")}
            onMouseUp={() => changeGoogleLoginButton("NORMAL")}
            onMouseLeave={() => changeGoogleLoginButton("NORMAL")}
            onClick={(event: any) => props.onClickFunction(event)}
        >
            <img src={googleLoginButtonImage} />
        </span>
    )
}
/*
on{() => {
    (async () => {
        await firebaseLogin();
        dispatch(creator_firebaselogin({
            currentUser: getCurrentUser()
        }))
    })();
}}
*/