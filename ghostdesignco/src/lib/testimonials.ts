/**
 * Video testimonials, in order.
 * Paste the platform's embed code (or the video link) in `embed`: Wistia,
 * YouTube, Vimeo, Instagram, TikTok and others work. A file placed in
 * /public/temoignages/ goes in `video`. `aspect` is width / height (9/16 by
 * default for vertical videos).
 * `name` is optional (none for now, by choice): `role` is then shown alone
 * under the video.
 */
export type Testimonial = {
  name?: string;
  role?: string;
  /** shown under the video, e.g. "2 min 33" */
  duration?: string;
  embed?: string;
  video?: string;
  poster?: string;
  aspect?: number;
};

export const testimonials: Testimonial[] = [
  {
    role: "Témoignage client",
    duration: "2 min 33",
    video: "/temoignages/temoignage-client.mp4",
    poster: "/temoignages/temoignage-client.jpg",
    aspect: 720 / 1024,
  },
  {
    role: "Témoignage client",
    duration: "3 min 34",
    embed: '<wistia-player media-id="7htowttuil" aspect="0.575"></wistia-player>',
    poster: "https://embed-ssl.wistia.com/deliveries/1a63017058b21ba4f2c6dff43e87049f19d73a41.jpg?image_crop_resized=368x640",
    aspect: 0.575,
  },
  {
    role: "Témoignage client",
    duration: "1 min 47",
    embed: '<wistia-player media-id="mz1v0wtjgg" aspect="0.575"></wistia-player>',
    poster: "https://embed-ssl.wistia.com/deliveries/6f83c73bd8d652511fd01064410d264c8daafea3.jpg?image_crop_resized=368x640",
    aspect: 0.575,
  },
  {
    role: "Retours clients en visio",
    duration: "27 min",
    embed: '<wistia-player media-id="52noyw8oi1" aspect="1.7777777777777777"></wistia-player>',
    poster: "https://embed-ssl.wistia.com/deliveries/ee10d098e2538f16ea75916315738a97b46fd075.jpg?image_crop_resized=960x540",
    aspect: 16 / 9,
  },
];

const youtubeId = (url: string) =>
  url.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|watch\?(?:.*&)?v=)|youtu\.be\/)([\w-]{11})/)?.[1];

/**
 * Player address for an embed code or a video link, plus a poster when the
 * platform provides one. Videos only load when the visitor presses play.
 */
export function embedPlayer(embed: string): { src: string; poster?: string } {
  const wistia = embed.match(/media-id=["']([\w]+)["']|wistia\.(?:com|net)\/(?:embed\/(?:iframe|medias)|medias)\/([\w]+)/);
  if (wistia) {
    const id = wistia[1] ?? wistia[2];
    return { src: `https://fast.wistia.net/embed/iframe/${id}?autoPlay=true&playerColor=b6ff3b&fitStrategy=contain` };
  }
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
