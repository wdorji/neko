"use client";

import generatePanel from "../components/about/designs";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";


export default function About() {

  const panel1props = {
    imageUrl: "https://images.unsplash.com/photo-1607066511406-a4b389dc138e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2415&q=80",
    content: "Neko is a web application designed to aid in providing hand-curated trail map with pictures and detailed descriptions to sacred and historical sites across the himalayan region.",
    boxWidth: "800",
    boxHeight: "225"
  }
  const panel2props = {

    content: `The inspiration for Neko came about from our childhood memories of going on a Nekor(གནས་སྐོར།) or pilgrimage with our grandparents to sacred sites in the himalayan region. 
    A highlight was always hearing the stories and historical accounts of the place from the elders and we realized that with modernization, most of these stories were going to die with them so to address cultural preservation, we wanted to create a literal story map curated by elders and historians.`,
    boxWidth: "1020",
    boxHeight: "350"
  }

  const panel3props = {
    imageUrl: "https://images.unsplash.com/photo-1605904583059-7880dad25595?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
    content: "Each Nekor has a chosen route to follow which tracks the users location on the route and updates a progress bar of the journey in terms of distance covered. There are also a list of checkpoints each which when clicked shows a picture of the site and its significance. The types of checkpoints are cultural landmarks, natural landmarks and recommended rest stops.",
    boxWidth: "1000",
    boxHeight: "310"
  }
  
  const panel4props = {

    content: "Before you start your Nekor, remember to wear sturdy, comfortable shoes to help prevent injury. Avoid bringing any unnecessary trash or materials that could potentially harm the environment. Be sure to pack out all of your trash, and if you see any litter while out on the trail, do your part to pick it up. Be respectful of posted signs and regulations, and refrain from making too much noise. Remember that you're sharing these experiences with others, and everyone deserves to enjoy the peace and quiet of these sacred sites.",
    boxWidth: "1000",
    boxHeight: "400"
  }

  return (
    <main>
      <ParallaxProvider>
      {generatePanel(panel1props)}
      {generatePanel(panel2props)}
      {generatePanel(panel3props)}
      {generatePanel(panel4props)}
      </ParallaxProvider>
    </main> 
  )
}