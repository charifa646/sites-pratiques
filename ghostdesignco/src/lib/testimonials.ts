/**
 * Video testimonials, in order.
 * TODO(client): one entry per video. Paste the platform's embed code (or the
 * video link) in `embed`: YouTube, Vimeo, Instagram, TikTok and others work.
 * `ratio` is "9:16" for vertical videos (default) or "16:9" for horizontal ones.
 * A video file placed in /public/temoignages/ also works with `video`.
 * While the list is empty, the section shows three reserved slots.
 *
 * Example:
 * { name: "Awa K.", role: "Fondatrice, Studio Nova", embed: '<iframe src="https://www.youtube.com/embed/…"></iframe>' }
 */
export type Testimonial = {
  name: string;
  role?: string;
  embed?: string;
  video?: string;
  poster?: string;
  ratio?: "9:16" | "16:9";
};

export const testimonials: Testimonial[] = [];

const youtubeId = (url: string) =>
  url.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|watch\?(?:.*&)?v=)|youtu\.be\/)([\w-]{11})/)?.[1];

/**
 * Player address for an embed code or a video link, plus a poster when the
 * platform provides one. Videos only load when the visitor presses play.
 */
export function embedPlayer(embed: string): { src: string; poster?: string } {
  const fromIframe = embed.match(/src=["']([^"']+)["']/i)?.[1];
  const url = (fromIframe ?? embed).trim().replace(/&amp;/g, "&");
  const yt = youtubeId(url);
  if (yt) return { src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&playsinline=1`, poster: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` };
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
  const hash = url.match(/[?&]h=(\w+)/)?.[1]; // private links need it
  if (vimeo) return { src: `https://player.vimeo.com/video/${vimeo}?${hash ? `h=${hash}&` : ""}autoplay=1` };
  const insta = url.match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/)?.[1];
  if (insta) return { src: `https://www.instagram.com/reel/${insta}/embed` };
  const tiktok = url.match(/tiktok\.com\/(?:@[\w.-]+\/video\/|embed\/v2\/|embed\/)(\d+)/)?.[1];
  if (tiktok) return { src: `https://www.tiktok.com/embed/v2/${tiktok}` };
  return { src: url };
}
