import FacebookIcon from "@/modules/common/icons/facebook";
import InstagramIcon from "@/modules/common/icons/instagram";
import YoutubeIcon from "@/modules/common/icons/youtube";

export const revalidateTime = 60;

export const adminCategoryId = 330;

export const pocetnaPostId = 41389;
export const cateringPostId = 41390;
export const kontaktPostId = 41391;

export const dvoraneCategoryId = 338;
export const promotivneUslugeCategoryId = 339;

export const mainNavigationLinks = [
  {
    title: "Početna",
    href: "/",
  },
  {
    title: "Dvorane",
    href: "/dvorane",
  },
  {
    title: "Promotivne usluge",
    href: "/promotivne-usluge",
  },
  {
    title: "Catering",
    href: "/catering",
  },
  {
    title: "Kontakt",
    href: "/kontakt",
  },
] as const;

export const socialItems = [
  {
    id: 1,
    name: "Facebook",
    icon: FacebookIcon,
    link: "https://www.facebook.com/sczg.unizg",
  },
  {
    id: 2,
    name: "Instagram",
    icon: InstagramIcon,
    link: "https://www.instagram.com/sczagreb/",
  },
  {
    id: 3,
    name: "YouTube",
    icon: YoutubeIcon,
    link: "https://www.youtube.com/@StudentskicentaruZagrebu",
  },
] as const;
