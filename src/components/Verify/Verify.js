import React, { useReducer } from 'react';
import "./Verify.css"
import {VerifyContext} from "../../context/verifyContext";
import axios from "axios";
import VerifyResults from "./VerifyResults";
import myImage from "./image.jpg";
import ocpApimSubscriptionKey from "../../context/keys"



const initialState = {submitButton: false, faceId1: "", faceId2:"", faceId1URL:"", faceId2URL:"", check1: true, check2: true, showComponent1: false, showComponent2: false}

const reducer = (state, action) => {
    
    switch (action.type) {
        case "faceId1Button": return {...state, faceId1: action.payload.response, check1:action.payload.checks, showComponent1: action.payload.show};
        case "faceId1URL": return {...state, faceId1URL: action.payload};

        case "faceId2Button": return {...state, faceId2: action.payload.response, check2: action.payload.checks, showComponent2: action.payload.show};
        case "faceId2URL": return {...state, faceId2URL: action.payload};

        case "checks": return {...state, check1: action.payload, check2: action.payload};

        
            
    
        default:
            return state
    }
}

export default function Verify(e) {

    // const [state, setState] = useState({submitButton: false});
    const [state, dispatch] = useReducer(reducer, initialState) 

    const detectFunc = (e) => {
        // console.log(e.target.id)
        const options = {
            method: 'POST',
            url: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?',
            params: {
              returnFaceId: 'true',
            },
            headers: {
              'content-type': 'application/json',
              'Ocp-Apim-Subscription-Key': ocpApimSubscriptionKey,
            },
            data: {url: e.target.id === "faceId1Button" ? state.faceId1URL : state.faceId2URL}
        };
          
        axios.request(options)
        .then(response => {
          
          dispatch({type: e.target.id, payload: {response: response.data[0].faceId, checks: false, show:true}})
        })
        .then(()=>{
            if(e.target.id === "faceId2Button"){
                dispatch({type: "submitButton", payload: true});
            }
        })
        .catch(function (error) {
            console.error(error);
        });
        

    }

    const handleInput = (e) => {
        dispatch({type: e.target.id, payload: e.target.value})
    }

    const unCheck = () => {
        dispatch({type: "checks", payload: true});
        
    }
    

    console.log(state)
    return (
        <VerifyContext.Provider value={{state, unCheck}}>
            <div id="verifyDiv">
                <div id="pictureOne" className="pictureClass">
                    <div className="imageDiv">
                        <img src={state.faceId1URL ? state.faceId1URL : myImage} alt="pictureOne" className="uploadImages"></img>
                    </div>
                    
                    
                    <input type="text" onChange={handleInput} id="faceId1URL" value={state.faceId1URL}/>
                    <button onClick={detectFunc} id="faceId1Button" type="button" className="uploadButtons" disabled={state.faceId1URL ? false : true}>Upload</button>
                    <span className="checks" id="check1" hidden={state.check1}><i className="fas fa-check"></i></span>
                </div>
                
                <div>
                    {state.showComponent1 && state.showComponent2 ? <VerifyResults /> : ""}
                </div>
                

                <div id="pictureTwo" className="pictureClass">
                    <div className="imageDiv">
                        <img src={state.faceId2URL ? state.faceId2URL : myImage} alt="pictureOne" className="uploadImages"></img>
                    </div>
                    
                    
                    <input type="text" id="faceId2URL" onChange={handleInput} value={state.faceId2URL}/>
                    <button onClick={detectFunc} id="faceId2Button" type="button" className="uploadButtons" disabled={state.faceId2URL ? false : true}>Upload</button>
                    <span className="checks" id="check2" hidden={state.check2}><i className="fas fa-check"></i></span>
                </div>
                
                
                
            </div>
            
        </VerifyContext.Provider>
    )
}
