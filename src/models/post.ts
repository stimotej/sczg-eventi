import { Document } from "./document";

export type Post = {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  template: string;
  meta: {
    ponuda: string;
    radno_vrijeme: string;
    menu_restaurant_id: number;
    menu_date: string;
    price: string;
    stock_status: string;
    allergens: string;
    weight: string;
    sadrzaj: string;
    start_showing: string;
    end_showing: string;
    show_always: boolean;
    event_date: string;
    documents: Document[];
    order: number;
    link: string;
    dates: string[];
    location: string;
    lokacija: string;
    type: string;
    show_on_slider: boolean;
    is_course: boolean;
    accordion_items: {
      title: string;
      description: string;
    }[];
    images: string[];
    rental_options: {
      title: string;
      subtitle: string;
      items: { title: string; price: string }[];
    }[];
    features: { title: string; description: string; image_url: string }[];
  };
  categories: number[];
  class_list: string[];
  image_url: string;
  author_meta: {
    ID: string;
    user_nicename: string;
    user_email: string;
    user_registered: string;
    display_name: string;
    first_name: string;
    last_name: string;
  };
  _links: {
    self: Array<{
      href: string;
      targetHints?: {
        allow: string[];
      };
    }>;
    collection: Array<{
      href: string;
    }>;
    about: Array<{
      href: string;
    }>;
    author: Array<{
      embeddable: boolean;
      href: string;
    }>;
    "wp:featuredmedia": Array<{
      embeddable: boolean;
      href: string;
    }>;
    "wp:attachment": Array<{
      href: string;
    }>;
    "wp:term": Array<{
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }>;
    curies: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;
  };
};
