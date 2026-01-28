export const projects = [
  {
    id: 1,
    title: "Jack Henry",
    description: "A comprehensive brand system and digital experience design.",
    poster: "/images/jackhenryheroimage.webp",
    content: [
      {
        type: "double",
        items: [
          { type: "image", src: "/images/jackhenryheroimage.webp" },
          { 
            type: "text", 
            body: "Introducing the project wasn’t just about a new product—it was about a whole new era in automation and industrial application." 
          }
        ]
      },
      // TIER: Mixed Video and Image
      {
        type: "double",
        items: [
          { 
            type: "video", 
            src: "/images/bb.mov" // Point to your video file
          },
          { type: "image", src: "/images/jackhenryheroimage.webp" }
        ]
      },
      // TIER: Full-width Hero Video
      {
        type: "full",
        items: [
          { 
            type: "video", 
            src: "/images/bb.mov" 
          }
        ]
      },
      {
        type: "triple",
        items: [
          { type: "image", src: "/images/jackhenryheroimage.webp" },
          { type: "image", src: "/images/jackhenryheroimage.webp" },
          { type: "image", src: "/images/jackhenryheroimage.webp" }
        ]
      }
    ]
  }
];