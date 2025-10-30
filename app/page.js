"use client";

import dynamic from "next/dynamic";

const ObjectDetection = dynamic(() => import("@/components/ObjectDetection"), {
  ssr: false, // ⛔ Disable SSR for this component
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="bg-linear-to-b from-white via-green-300 to-gray-600 gradient bg-clip-text text-transparent font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter md:px-6">
        Object Detection App
      </h1>
      <ObjectDetection />
    </main>
  );
}
