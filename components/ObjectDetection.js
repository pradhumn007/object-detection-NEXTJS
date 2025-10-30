"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionInterval = useRef(null);

  // Load COCO-SSD model and start detection
  const runCoco = async () => {
    setIsLoading(true);

    try {
      const net = await cocoSsd.load();
      setIsLoading(false);

      detectionInterval.current = setInterval(() => {
        runObjectDetection(net);
      }, 100); // use 100ms instead of 10ms to prevent lag
    } catch (error) {
      console.error("Failed to load COCO-SSD model:", error);
      setIsLoading(false);
    }
  };

  // Perform object detection
  const runObjectDetection = async (net) => {
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;

    if (webcam && webcam.video && webcam.video.readyState === 4 && canvas) {
      const video = webcam.video;

      // Set canvas size equal to video size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const detectedObjects = await net.detect(video, undefined, 0.6);
      const ctx = canvas.getContext("2d");

      // Clear previous drawings
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      renderPredictions(detectedObjects, ctx);
    }
  };

  // Set correct video dimensions once webcam is ready
  const showMyVideo = () => {
    const webcam = webcamRef.current;
    if (webcam && webcam.video && webcam.video.readyState === 4) {
      webcam.video.width = webcam.video.videoWidth;
      webcam.video.height = webcam.video.videoHeight;
    }
  };

  // Cleanup detection interval on component unmount
  useEffect(() => {
    runCoco();
    showMyVideo();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="gradient-text">Loading AI Model...</div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          {/* Webcam */}
          <Webcam
            ref={webcamRef}
            className="rounded-md w-full lg:h-[720px]"
            muted
            videoConstraints={{
              facingMode: "user",
            }}
          />
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
