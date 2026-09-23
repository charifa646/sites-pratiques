/**
 * Video testimonials.
 * TODO(client): add the videos in /public/temoignages/ and one entry per video:
 * name, role (optional, e.g. "Gérante, Studio Nova"), video file, poster image.
 * While the list is empty, the section shows three reserved slots.
 */
export type Testimonial = {
  name: string;
  role?: string;
  video: string;
  poster?: string;
};

export const testimonials: Testimonial[] = [];
