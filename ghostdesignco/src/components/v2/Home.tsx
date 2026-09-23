import { V2Contact } from "./Contact";
import { V2Header } from "./Header";
import { V2Hero } from "./Hero";
import { V2Services } from "./Services";

/**
 * V2: the same agency, told calmly. No 3D world: a light page, website
 * mockups drawn in HTML, the glass ghost as a still image.
 */
export function V2Home() {
  return (
    <>
      <V2Header />
      <main>
        <V2Hero />
        <V2Services />
        <V2Contact />
      </main>
    </>
  );
}
