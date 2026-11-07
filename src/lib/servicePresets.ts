import type { Category } from "@/db/schema";

export interface ServicePreset {
  name: string;
  emoji: string;
  category: Category;
  color: string;
  /** Domain used to fetch a real logo via Clearbit, e.g. "netflix.com" */
  domain: string;
}

/** Returns the Clearbit logo URL for a preset (128 × 128 PNG). */
export function logoUrl(preset: ServicePreset): string {
  return `https://logo.clearbit.com/${preset.domain}?size=128`;
}

export const SERVICE_PRESETS: ServicePreset[] = [
  // ── Streaming ──────────────────────────────────────────────────────────
  { name: "Netflix", emoji: "🎬", category: "streaming", color: "#E50914", domain: "netflix.com" },
  {
    name: "Disney+",
    emoji: "✨",
    category: "streaming",
    color: "#113CCF",
    domain: "disneyplus.com",
  },
  {
    name: "Amazon Prime",
    emoji: "📦",
    category: "streaming",
    color: "#00A8E0",
    domain: "primevideo.com",
  },
  { name: "Apple TV+", emoji: "🍎", category: "streaming", color: "#555555", domain: "apple.com" },
  { name: "HBO Max", emoji: "🎭", category: "streaming", color: "#5822B4", domain: "max.com" },
  { name: "Hulu", emoji: "📺", category: "streaming", color: "#1CE783", domain: "hulu.com" },
  {
    name: "Crunchyroll",
    emoji: "🍥",
    category: "streaming",
    color: "#F47521",
    domain: "crunchyroll.com",
  },
  { name: "Canal+", emoji: "📡", category: "streaming", color: "#000000", domain: "canalplus.com" },
  {
    name: "Paramount+",
    emoji: "⭐",
    category: "streaming",
    color: "#0064FF",
    domain: "paramountplus.com",
  },
  { name: "Plex", emoji: "🎞️", category: "streaming", color: "#E5A00D", domain: "plex.tv" },

  // ── Music ──────────────────────────────────────────────────────────────
  { name: "Spotify", emoji: "🎵", category: "music", color: "#1DB954", domain: "spotify.com" },
  {
    name: "Apple Music",
    emoji: "🎶",
    category: "music",
    color: "#FC3C44",
    domain: "music.apple.com",
  },
  {
    name: "YouTube Music",
    emoji: "▶️",
    category: "music",
    color: "#FF0000",
    domain: "music.youtube.com",
  },
  { name: "Deezer", emoji: "🎧", category: "music", color: "#A238FF", domain: "deezer.com" },
  { name: "Tidal", emoji: "🌊", category: "music", color: "#000000", domain: "tidal.com" },
  {
    name: "Amazon Music",
    emoji: "🎼",
    category: "music",
    color: "#00A8E0",
    domain: "music.amazon.com",
  },

  // ── Software / Productivity ────────────────────────────────────────────
  { name: "Adobe CC", emoji: "🎨", category: "software", color: "#FF0000", domain: "adobe.com" },
  {
    name: "Microsoft 365",
    emoji: "💼",
    category: "software",
    color: "#D83B01",
    domain: "microsoft.com",
  },
  { name: "Notion", emoji: "📝", category: "software", color: "#000000", domain: "notion.so" },
  { name: "Figma", emoji: "🖌️", category: "software", color: "#F24E1E", domain: "figma.com" },
  { name: "GitHub Pro", emoji: "🐙", category: "software", color: "#24292F", domain: "github.com" },
  { name: "Linear", emoji: "⚡", category: "software", color: "#5E6AD2", domain: "linear.app" },
  { name: "Slack", emoji: "💬", category: "software", color: "#4A154B", domain: "slack.com" },
  { name: "Zoom", emoji: "📹", category: "software", color: "#2D8CFF", domain: "zoom.us" },

  // ── Cloud / Storage ────────────────────────────────────────────────────
  { name: "iCloud+", emoji: "☁️", category: "cloud", color: "#3478F6", domain: "icloud.com" },
  {
    name: "Google One",
    emoji: "🔵",
    category: "cloud",
    color: "#4285F4",
    domain: "one.google.com",
  },
  { name: "Dropbox", emoji: "📂", category: "cloud", color: "#0061FF", domain: "dropbox.com" },
  { name: "1Password", emoji: "🔑", category: "cloud", color: "#1A8CFF", domain: "1password.com" },
  { name: "NordVPN", emoji: "🛡️", category: "cloud", color: "#4687FF", domain: "nordvpn.com" },
  { name: "Apple One", emoji: "🍏", category: "cloud", color: "#555555", domain: "apple.com" },

  // ── Gaming ─────────────────────────────────────────────────────────────
  {
    name: "PlayStation Plus",
    emoji: "🎮",
    category: "gaming",
    color: "#003087",
    domain: "playstation.com",
  },
  { name: "Xbox Game Pass", emoji: "🟢", category: "gaming", color: "#107C10", domain: "xbox.com" },
  {
    name: "Nintendo Online",
    emoji: "🔴",
    category: "gaming",
    color: "#E60012",
    domain: "nintendo.com",
  },
  { name: "EA Play", emoji: "🏆", category: "gaming", color: "#FF4747", domain: "ea.com" },

  // ── Fitness / Wellness ─────────────────────────────────────────────────
  { name: "Strava", emoji: "🏃", category: "fitness", color: "#FC4C02", domain: "strava.com" },
  {
    name: "Headspace",
    emoji: "🧘",
    category: "fitness",
    color: "#F47D31",
    domain: "headspace.com",
  },
  { name: "Calm", emoji: "🌙", category: "fitness", color: "#4A90D9", domain: "calm.com" },
  {
    name: "Duolingo Plus",
    emoji: "🦜",
    category: "fitness",
    color: "#58CC02",
    domain: "duolingo.com",
  },
  {
    name: "MyFitnessPal",
    emoji: "💪",
    category: "fitness",
    color: "#0066CC",
    domain: "myfitnesspal.com",
  },

  // ── News ───────────────────────────────────────────────────────────────
  { name: "Le Monde", emoji: "📰", category: "news", color: "#1A1A1A", domain: "lemonde.fr" },
  {
    name: "New York Times",
    emoji: "🗞️",
    category: "news",
    color: "#000000",
    domain: "nytimes.com",
  },
  { name: "Medium", emoji: "✍️", category: "news", color: "#000000", domain: "medium.com" },
];
