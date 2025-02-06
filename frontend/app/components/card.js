"use client";

import { CardBody, CardContainer, CardItem } from "@/app/components/ui/3d-card";
import Link from "next/link";
import React from "react";

export function ThreeDCardDemo() {
  return (
    <CardContainer className="flex flex-col items-center py-0">
      <CardBody className="max-w-3xl text-center p-6 bg-white rounded-2xl shadow dark:bg-gray-100 dark:bg-opacity-5 flex flex-col items-center">
        <CardItem
          translateZ="50"
          className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
        ></CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Adhuni
        </CardItem>
        <div className="flex justify-center items-center mt-4">
          <Link href="/Upload">
            <CardItem
              translateZ={20}
              as="button"
              className="shadow-2xl inline-flex items-center px-5 py-4 text-base font-medium text-center text-white bg-gray-800 rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 fo dark:bg-gray-700 dark:hover:bg-blue-800 dark:focus:ring-gray-800 transform transition-transform duration-200 hover:translate-y-[-2px]"
            >
              Get Started
            </CardItem>
          </Link>
        </div>
        <CardItem
          as="p"
          translateZ="40"
          className="mb-3 my-3 font-normal text-gray-700 dark:text-gray-400 text-center"
        >
          We've developed a model called Adhuni, which specializes in generating
          summaries from videos. The model interacts with video content in a
          systematic way, storing essential information like video metadata,
          transcribed summaries, and relevant screenshots. It also generates
          multiple questions related to the content of each uploaded video. This
          design makes it possible for Adhuni to provide concise summaries,
          engage users with interactive questions, and assist in comprehending
          complex video content efficiently.
        </CardItem>
        <CardItem
          as="p"
          translateZ="40"
          className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-center"
        >
          The dialogue-inspired format allows Adhuni to adapt to user needs,
          refine its outputs based on user feedback, and handle a wide variety
          of video types, ensuring a versatile and robust solution for content
          summarization.
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
