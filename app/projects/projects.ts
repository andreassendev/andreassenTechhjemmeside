export interface Project {
  title: string;
  href: string;
  imageSrc: string;
  subtitle?: string;
}

export const projects: Project[] = [
  {
    title: "StudyAI",
    href: "/projects/studyai",
    imageSrc: "/studyaiAtech.png",
    subtitle: "AI-driven study product — currently in development"
  },
  {
    title: "Andreassen Kapital",
    href: "https://www.andreassenkapital.no/",
    imageSrc: "/andreassenKapitalaTech.png",
    subtitle: "Corporate website — in-house design, development and maintenance"
  },
  {
    title: "Private Consulting",
    href: "/projects/andreassen-technology",
    imageSrc: "/andreassentechconsults.png",
    subtitle: "Independent consulting and technical advisory (selected work)"
  }
];

// Temporarily hidden projects (can be re-added later):
// {
//   title: "Bergen Badstu",
//   href: "https://www.bergenbadstu.no/",
//   imageSrc: "/bergenBadstueAtech.png",
//   subtitle: "Website design, development and ongoing management"
// },
