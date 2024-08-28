import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from 'react-webcam';


function App() {
  const webCamRef = useRef(null)
  const canvasRef = useRef(null)



  const runBodySegment = async () => {
    const net = await bodyPix.load();
    console.log('BodyPix loaded');
    setInterval(()=>{
      detect(net)
    },100)
  }

  const detect = async (net) => {
    //check data is available

    if(typeof webCamRef.current != 'undefined' && webCamRef.current != null && webCamRef.current.video.readyState == 4){
      //get vidoe properties
      const video = webCamRef.current.video;
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;

      //set video width and height
      webCamRef.current.video.width = videoWidth;
      webCamRef.current.video.height = videoHeight;

      //set canvas width and height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;


      //make detections
      const person = await net.segmentPersonParts(video);
      console.log(person)
      // draw detections 
      const coloredPartImage = bodyPix.toColoredPartMask(person);

      bodyPix.drawMask(
        canvasRef.current,
        video,
        coloredPartImage,
        0.7,
        0,
        false
      )
    }

  }
  runBodySegment()
  return (
    <>
      <Webcam ref={webCamRef} 
        style={{
          position:'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex:9,
          width:640,
          height:480
        }}
      />
      <canvas ref={canvasRef} 
          style={{
            position:'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            textAlign: 'center',
            zIndex:9,
            width:640,
            height:480
          }}
      />
    </>
  )
}

export default App
