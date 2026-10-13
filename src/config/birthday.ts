/**
 * ─────────────────────────────────────────────────────────────
 *  PERSONALIZE EVERYTHING HERE.
 *  Every name, message, photo, video and colour on the site
 *  comes from this file. You never need to touch component code.
 * ─────────────────────────────────────────────────────────────
 *
 *  Photos  → put files in /public/images and set `src: "/images/your-file.jpg"`
 *  Videos  → put files in /public/videos and set `src` (and optionally `poster`)
 *  Music   → put a LICENSED track in /public/audio and set `music.src`
 *
 *  Leave `src` empty ("") to show an elegant placeholder instead.
 */

export type Photo = {
  /** Path inside /public, e.g. "/images/beach.jpg". Empty = placeholder. */
  src: string;
  alt: string;
  caption: string;
  /** Free text, e.g. "Summer 2024". Leave empty to hide. */
  date: string;
  orientation: "portrait" | "landscape" | "square";
  style: "polaroid" | "editorial";
  /** Degrees. Keep small (-4 … 4). */
  rotate?: number;
};

export type Video = {
  src: string;
  poster: string;
  title: string;
  date: string;
  /** Shown in the film frame, e.g. "00:14". */
  duration: string;
};

export const birthday = {
  herName: "Sumithra",
  yourName: "Shankar",

  /**
   * ISO date of her birthday, e.g. "2026-11-02".
   * Leave empty to hide the date & countdown entirely.
   */
  birthdayDate: "",

  meta: {
    title: "A Little Universe Made Just for You",
    description: "A birthday surprise, made with love.",
    /** Optional: "/og.jpg" placed in /public (1200×630). */
    ogImage: "",
  },

  opening: {
    lockTitle: "This little universe is locked.",
    lockHint: "Enter the password to come inside.",
    lockButton: "Unlock",
    lockError: "That's not quite it. Try again.",
    reveal: "Happy Birthday, My Love.",
  },

  hero: {
    headline: "Happy Birthday,",
    subtitle:
      "Today, the world celebrates you. And I celebrate the day my favorite person was born.",
    caption: "My favorite person. My favorite story.",
    photo: {
      src: "/images/15-mountains.jpg",
      alt: "Shankar and Sumithra together in the mountains",
      caption: "My favorite person. My favorite story.",
      date: "",
      orientation: "portrait",
      style: "editorial",
    },
  },

  /**
   * The message section. Words light up one by one as she scrolls.
   * Wrap words in *asterisks* to make them glow in gold italics.
   * `notes` are little handwritten cards tucked between the paragraphs.
   */
  message: {
    eyebrow: "For my Chinnuu Ma",
    title: "Happy 24th Birthday",
    paragraphs: [
      "Happy birthday to the most beautiful person in my life. Today is extra special because it's your *24th birthday,* and I feel so lucky to be the person celebrating this beautiful day with you.",
      "This is the *second birthday* we're celebrating together after committing to each other, and honestly, I couldn't be happier to have you in my life.",
      "Baby, ever since you came into my life, every single day has become more beautiful and meaningful. I have enjoyed each and every day being with you, whether it's our conversations, our silly fights, our laughter, our little moments, or even the times when we do nothing but stay connected. Every moment with you has become a memory that I want to keep close to my heart *forever.*",
      "Bbz, you have no idea how happy you make me. Sometimes, I just think about us and smile for no reason. Having you beside me, sharing my happiness, listening to me, and being a part of my everyday life is one of the best feelings I've ever experienced. I don't need every day to be perfect. I just want you to be there with me through all the *ups and downs.*",
      "Chinnuu ma, on your special day, I wish you endless happiness, good health, success, and everything your *beautiful heart* desires. I promise to keep loving you, supporting you, making you smile, and choosing you again and again. I want to celebrate many more birthdays with you, create countless memories, and grow together while holding each other's hands.",
      "Happy birthday once again, my baby. Thank you for coming into my life and making it so beautiful. If I had to choose someone all over again, I would still choose you, *a thousand times,* in a thousand different lifetimes.",
      "I love you so much, my Chinnuu ma. You will always have a very special place in my heart.",
    ],
    notes: [
      "My baby. My BBZ. My Chinnuu Ma.",
      "Our second birthday together.",
      "I smile for no reason, just thinking of us.",
      "I promise to choose you again and again.",
    ],
    closing: "Forever yours, my love,",
  },

  gallery: {
    title: "Our Little World",
    subtitle: "Sixteen frames from our days. Tap any one to see it closer.",
    photos: [
      { src: "/images/15-mountains.jpg", alt: "Shankar and Sumithra in the mountains", caption: "Above the clouds", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/03-road.jpg", alt: "Sumithra in a white sweater, Shankar behind her on a mountain road", caption: "On the road", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/11-side-by-side.jpg", alt: "Shankar and Sumithra in hoodies, cheek to cheek", caption: "Side by side", date: "", orientation: "portrait", style: "polaroid", rotate: 1.5 },
      { src: "/images/09-gold.jpg", alt: "Sumithra in a yellow shawl and green sari", caption: "In gold", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/08-marathon.jpg", alt: "Sumithra with a medal after the Coimbatore Women's Marathon", caption: "Ten kilometres, finished", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/02-smile.jpg", alt: "Sumithra smiling on a phone call", caption: "That smile", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/06-hill.jpg", alt: "Shankar and Sumithra on a hill road", caption: "The hill road", date: "", orientation: "landscape", style: "editorial" },
      { src: "/images/14-denim.jpg", alt: "Shankar and Sumithra standing on a hillside road", caption: "Wherever the road goes", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/01-neon.jpg", alt: "A mirror selfie of Sumithra and Shankar in purple neon light", caption: "Neon light, and you", date: "", orientation: "portrait", style: "polaroid", rotate: -2 },
      { src: "/images/04-home.jpg", alt: "Sumithra hugging Shankar in a mirror selfie", caption: "Home", date: "", orientation: "portrait", style: "polaroid", rotate: 2 },
      { src: "/images/10-afternoon.jpg", alt: "Sumithra and Shankar resting together", caption: "A quiet afternoon", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/16-overlook.jpg", alt: "A motorcycle parked at a mountain overlook", caption: "Worth stopping for", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/07-little-birthday.jpg", alt: "Sumithra holding a child in front of a birthday banner", caption: "A little birthday", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/12-bows.jpg", alt: "Shankar, Sumithra, and a child with pink bow stickers", caption: "Bows and all", date: "", orientation: "portrait", style: "polaroid", rotate: -1.5 },
      { src: "/images/13-mirror.jpg", alt: "A mirror selfie of Sumithra, a child, and Shankar", caption: "The little one between us", date: "", orientation: "portrait", style: "editorial" },
      { src: "/images/05-helmets.jpg", alt: "Shankar and Sumithra on a motorcycle in helmets", caption: "Helmets on", date: "", orientation: "portrait", style: "polaroid", rotate: 2.5 },
    ] satisfies Photo[],
  },

  videos: {
    title: "Little Moments,",
    titleAccent: "Forever Memories.",
    items: [
      { src: "/videos/clips/01.mp4", poster: "/images/posters/01.mp4.png", title: "Under the awning", date: "", duration: "0:09" },
      { src: "/videos/clips/02.mp4", poster: "/images/posters/02.mp4.png", title: "A bow in his hair", date: "", duration: "0:04" },
      { src: "/videos/clips/03.mp4", poster: "/images/posters/03.mp4.png", title: "The red phone", date: "", duration: "0:08" },
      { src: "/videos/clips/04.mp4", poster: "/images/posters/04.mp4.png", title: "The long white dress", date: "", duration: "0:03" },
      { src: "/videos/clips/05.mp4", poster: "/images/posters/05.mp4.png", title: "Smileys", date: "", duration: "0:04" },
    ] satisfies Video[],
  },

  cake: {
    heading: "Make a wish, birthday girl.",
    eyebrow: "One more surprise",
    button: "Make a Wish ✨",
    afterWish: "May all your beautiful wishes come true.",
    candles: 5,
  },

  finale: {
    birthday: "Happy Birthday,",
    closing: "Today is your day. But loving you is my favorite gift.",
    portrait: {
      src: "/images/11-side-by-side.jpg",
      alt: "Shankar and Sumithra, close together",
    },
  },

  music: {
    /**
     * Path to a LICENSED audio file in /public/audio, e.g. "/audio/our-song.mp3".
     * Leave empty to use a soft, generated music-box melody (no file needed).
     */
    src: "/audio/song.mp3",
    /** Start music when she opens the surprise (it's a user interaction). */
    startOnOpen: true,
    volume: 0.45,
  },

  /** Subtle synthesized sound effects (envelope, candles, finale). */
  soundEffects: true,

  theme: {
    blush: "#f4d3d6",
    rose: "#c58690",
    burgundy: "#5b1a2e",
    lavender: "#cbbfe2",
    gold: "#d9b878",
    ivory: "#fbf5ee",
    plum: "#1b0e22",
  },
} as const;

export type BirthdayConfig = typeof birthday;
