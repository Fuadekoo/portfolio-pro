/**
 * Optional social proof. Only add VERIFIED content.
 * The section is hidden entirely while both arrays are empty.
 */

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  /** Optional link to the source (e.g. a LinkedIn recommendation). */
  href?: string;
};

export type Achievement = {
  title: string;
  issuer: string;
  date: string;
  href?: string;
};

export const testimonials: Testimonial[] = [];

export const achievements: Achievement[] = [];
