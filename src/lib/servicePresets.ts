import type { Category } from "@/db/schema";

export interface ServicePreset {
  name: string;
  emoji: string;
  category: Category;
  color: string;
}

export const SERVICE_PRESETS: ServicePreset[] = [
  // ── Streaming ──────────────────────────────────────────────────────────
  { name: "Netflix", emoji: "🎬", category: "streaming", color: "#E50914" },
  { name: "Disney+", emoji: "✨", category: "streaming", color: "#113CCF" },
  { name: "Amazon Prime", emoji: "📦", category: "streaming", color: "#00A8E0" },
  { name: "Apple TV+", emoji: "🍎", category: "streaming", color: "#555555" },
  { name: "HBO Max", emoji: "🎭", category: "streaming", color: "#5822B4" },
  { name: "Hulu", emoji: "📺", category: "streaming", color: "#1CE783" },
  { name: "Crunchyroll", emoji: "🍥", category: "streaming", color: "#F47521" },
  { name: "Canal+", emoji: "📡", category: "streaming", color: "#000000" },
  { name: "Paramount+", emoji: "⭐", category: "streaming", color: "#0064FF" },
  { name: "Plex", emoji: "🎞️", category: "streaming", color: "#E5A00D" },

  // ── Music ──────────────────────────────────────────────────────────────
  { name: "Spotify", emoji: "🎵", category: "music", color: "#1DB954" },
  { name: "Apple Music", emoji: "🎶", category: "music", color: "#FC3C44" },
  { name: "YouTube Music", emoji: "▶️", category: "music", color: "#FF0000" },
  { name: "Deezer", emoji: "🎧", category: "music", color: "#A238FF" },
  { name: "Tidal", emoji: "🌊", category: "music", color: "#000000" },
  { name: "Amazon Music", emoji: "🎼", category: "music", color: "#00A8E0" },

  // ── Software / Productivity ────────────────────────────────────────────
  { name: "Adobe CC", emoji: "🎨", category: "software", color: "#FF0000" },
  { name: "Microsoft 365", emoji: "💼", category: "software", color: "#D83B01" },
  { name: "Notion", emoji: "📝", category: "software", color: "#000000" },
  { name: "Figma", emoji: "🖌️", category: "software", color: "#F24E1E" },
  { name: "GitHub Pro", emoji: "🐙", category: "software", color: "#24292F" },
  { name: "Linear", emoji: "⚡", category: "software", color: "#5E6AD2" },
  { name: "Slack", emoji: "💬", category: "software", color: "#4A154B" },
  { name: "Zoom", emoji: "📹", category: "software", color: "#2D8CFF" },

  // ── Cloud / Storage ────────────────────────────────────────────────────
  { name: "iCloud+", emoji: "☁️", category: "cloud", color: "#3478F6" },
  { name: "Google One", emoji: "🔵", category: "cloud", color: "#4285F4" },
  { name: "Dropbox", emoji: "📂", category: "cloud", color: "#0061FF" },
  { name: "1Password", emoji: "🔑", category: "cloud", color: "#1A8CFF" },
  { name: "NordVPN", emoji: "🛡️", category: "cloud", color: "#4687FF" },
  { name: "Apple One", emoji: "🍏", category: "cloud", color: "#555555" },

  // ── Gaming ─────────────────────────────────────────────────────────────
  { name: "PlayStation Plus", emoji: "🎮", category: "gaming", color: "#003087" },
  { name: "Xbox Game Pass", emoji: "🟢", category: "gaming", color: "#107C10" },
  { name: "Nintendo Online", emoji: "🔴", category: "gaming", color: "#E60012" },
  { name: "EA Play", emoji: "🏆", category: "gaming", color: "#FF4747" },

  // ── Fitness / Wellness ─────────────────────────────────────────────────
  { name: "Strava", emoji: "🏃", category: "fitness", color: "#FC4C02" },
  { name: "Headspace", emoji: "🧘", category: "fitness", color: "#F47D31" },
  { name: "Calm", emoji: "🌙", category: "fitness", color: "#4A90D9" },
  { name: "Duolingo Plus", emoji: "🦜", category: "fitness", color: "#58CC02" },
  { name: "MyFitnessPal", emoji: "💪", category: "fitness", color: "#0066CC" },

  // ── News ───────────────────────────────────────────────────────────────
  { name: "Le Monde", emoji: "📰", category: "news", color: "#1A1A1A" },
  { name: "New York Times", emoji: "🗞️", category: "news", color: "#000000" },
  { name: "Medium", emoji: "✍️", category: "news", color: "#000000" },
];
