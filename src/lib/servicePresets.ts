import type { Category } from "@/db/schema";

export interface ServicePreset {
  name: string;
  emoji: string;
  category: Category;
  color: string;
  /**
   * Key into the `simple-icons` package (e.g. "siNetflix").
   * null = no entry in simple-icons; falls back to emoji.
   */
  siKey: string | null;
}

export const SERVICE_PRESETS: ServicePreset[] = [
  // ── Streaming ──────────────────────────────────────────────────────────
  { name: "Netflix", emoji: "🎬", category: "streaming", color: "#E50914", siKey: "siNetflix" },
  { name: "Disney+", emoji: "✨", category: "streaming", color: "#113CCF", siKey: null },
  { name: "Amazon Prime", emoji: "📦", category: "streaming", color: "#00A8E0", siKey: null },
  { name: "Apple TV+", emoji: "🍎", category: "streaming", color: "#1C1C1E", siKey: "siAppletv" },
  { name: "HBO Max", emoji: "🎭", category: "streaming", color: "#5822B4", siKey: "siHbomax" },
  { name: "Hulu", emoji: "📺", category: "streaming", color: "#1CE783", siKey: null },
  {
    name: "Crunchyroll",
    emoji: "🍥",
    category: "streaming",
    color: "#F47521",
    siKey: "siCrunchyroll",
  },
  { name: "Canal+", emoji: "📡", category: "streaming", color: "#000000", siKey: null },
  {
    name: "Paramount+",
    emoji: "⭐",
    category: "streaming",
    color: "#0064FF",
    siKey: "siParamountplus",
  },
  { name: "Plex", emoji: "🎞️", category: "streaming", color: "#E5A00D", siKey: "siPlex" },

  // ── Music ──────────────────────────────────────────────────────────────
  { name: "Spotify", emoji: "🎵", category: "music", color: "#1DB954", siKey: "siSpotify" },
  { name: "Apple Music", emoji: "🎶", category: "music", color: "#FC3C44", siKey: "siApplemusic" },
  {
    name: "YouTube Music",
    emoji: "▶️",
    category: "music",
    color: "#FF0000",
    siKey: "siYoutubemusic",
  },
  { name: "Deezer", emoji: "🎧", category: "music", color: "#A238FF", siKey: "siDeezer" },
  { name: "Tidal", emoji: "🌊", category: "music", color: "#000000", siKey: "siTidal" },
  { name: "Amazon Music", emoji: "🎼", category: "music", color: "#00A8E0", siKey: null },

  // ── Software / Productivity ────────────────────────────────────────────
  { name: "Adobe CC", emoji: "🎨", category: "software", color: "#FF0000", siKey: null },
  { name: "Microsoft 365", emoji: "💼", category: "software", color: "#D83B01", siKey: null },
  { name: "Notion", emoji: "📝", category: "software", color: "#000000", siKey: "siNotion" },
  { name: "Figma", emoji: "🖌️", category: "software", color: "#F24E1E", siKey: "siFigma" },
  { name: "GitHub Pro", emoji: "🐙", category: "software", color: "#24292F", siKey: "siGithub" },
  { name: "Linear", emoji: "⚡", category: "software", color: "#5E6AD2", siKey: "siLinear" },
  { name: "Slack", emoji: "💬", category: "software", color: "#4A154B", siKey: null },
  { name: "Zoom", emoji: "📹", category: "software", color: "#2D8CFF", siKey: "siZoom" },

  // ── Cloud / Storage ────────────────────────────────────────────────────
  { name: "iCloud+", emoji: "☁️", category: "cloud", color: "#3478F6", siKey: "siIcloud" },
  { name: "Google One", emoji: "🔵", category: "cloud", color: "#4285F4", siKey: "siGoogledrive" },
  { name: "Dropbox", emoji: "📂", category: "cloud", color: "#0061FF", siKey: "siDropbox" },
  { name: "1Password", emoji: "🔑", category: "cloud", color: "#1A8CFF", siKey: "si1password" },
  { name: "NordVPN", emoji: "🛡️", category: "cloud", color: "#4687FF", siKey: "siNordvpn" },
  { name: "Apple One", emoji: "🍏", category: "cloud", color: "#1C1C1E", siKey: "siApple" },

  // ── Gaming ─────────────────────────────────────────────────────────────
  {
    name: "PlayStation Plus",
    emoji: "🎮",
    category: "gaming",
    color: "#003087",
    siKey: "siPlaystation",
  },
  { name: "Xbox Game Pass", emoji: "🟢", category: "gaming", color: "#107C10", siKey: null },
  { name: "Nintendo Online", emoji: "🔴", category: "gaming", color: "#E60012", siKey: null },
  { name: "EA Play", emoji: "🏆", category: "gaming", color: "#FF4747", siKey: "siEa" },

  // ── Fitness / Wellness ─────────────────────────────────────────────────
  { name: "Strava", emoji: "🏃", category: "fitness", color: "#FC4C02", siKey: "siStrava" },
  { name: "Headspace", emoji: "🧘", category: "fitness", color: "#F47D31", siKey: "siHeadspace" },
  { name: "Calm", emoji: "🌙", category: "fitness", color: "#4A90D9", siKey: null },
  {
    name: "Duolingo Plus",
    emoji: "🦜",
    category: "fitness",
    color: "#58CC02",
    siKey: "siDuolingo",
  },
  { name: "MyFitnessPal", emoji: "💪", category: "fitness", color: "#0066CC", siKey: null },

  // ── News ───────────────────────────────────────────────────────────────
  { name: "Le Monde", emoji: "📰", category: "news", color: "#1A1A1A", siKey: null },
  {
    name: "New York Times",
    emoji: "🗞️",
    category: "news",
    color: "#000000",
    siKey: "siNewyorktimes",
  },
  { name: "Medium", emoji: "✍️", category: "news", color: "#000000", siKey: "siMedium" },
];
