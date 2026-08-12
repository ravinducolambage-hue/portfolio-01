export interface Reference {
  id: number;
  name: string;
  title: string;
  department: string;
  faculty: string;
  university: string;
  email: string | { primary: string; secondary?: string };
  mobile?: string;
  office?: string;
  tel?: string;
  website?: string;
  initials: string;
  photoFile: string;
}

export const REFERENCES_DATA: Reference[] = [
  {
    id: 1,
    name: "Dr. T.M.K.K. Jinasena",
    title: "Senior Lecturer",
    department: "Department of Computer Science",
    faculty: "Faculty of Applied Sciences",
    university: "University of Sri Jayewardenepura, Sri Lanka",
    email: "kasun@sjp.ac.lk",
    mobile: "+94 71 250 3003",
    office: "+94 112 758 907",
    initials: "TJ",
    photoFile: "ref1_jinasena.jpg",
  },
  {
    id: 2,
    name: "Dr. Surani Tissera",
    title: "Senior Lecturer in Computer Science",
    department: "Department of Computer Science",
    faculty: "Faculty of Applied Sciences",
    university: "University of Sri Jayewardenepura, Gangodawila, Nugegoda, Sri Lanka",
    email: {
      primary: "suranishalika@sjp.ac.lk",
      secondary: "surani@sci.sjp.ac.lk",
    },
    tel: "+94 11 2758912",
    mobile: "+94 74 2916161",
    website: "https://www.sjp.ac.lk/",
    initials: "ST",
    photoFile: "ref2_tissera.jpg",
  },
  {
    id: 3,
    name: "Vindya Senanayake",
    title: "Lecturer (Probationary)",
    department: "Department of Knowledge Engineering and Communication",
    faculty: "Faculty of Computing",
    university: "University of Sri Jayewardenepura, Sri Lanka",
    email: "vindya@sjp.ac.lk",
    initials: "VS",
    photoFile: "ref3_senanayake.jpg",
  },
];
