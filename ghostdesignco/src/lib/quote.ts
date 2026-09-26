/**
 * The quote window: where a page has one (the site), the calls to action open
 * it instead of scrolling to the contact section (see goTo and diveTo).
 */
let opener: (() => void) | null = null;

export const quote = {
  /** The window registers itself; returns the way to unregister. */
  register(open: () => void) {
    opener = open;
    return () => {
      if (opener === open) opener = null;
    };
  },
  /** Opens the window if the page has one; false otherwise. */
  open() {
    if (!opener) return false;
    opener();
    return true;
  },
};
