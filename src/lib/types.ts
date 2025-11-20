// Tipos principais do Conquerix

export type ActivityType = 'run' | 'walk' | 'bike';

export interface User {
  id: string;
  username: string;
  avatar_url?: string;
  level: number;
  xp: number;
  total_distance: number;
  total_activities: number;
  territories_count: number;
  premium: boolean;
  streak_days: number;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  distance: number; // km
  duration: number; // segundos
  avg_speed: number; // km/h
  max_speed: number; // km/h
  calories: number;
  xp_earned: number;
  route: [number, number][]; // [lat, lng][]
  territories_conquered: number;
  started_at: string;
  finished_at: string;
}

export interface Territory {
  id: string;
  owner_id: string;
  owner_username: string;
  owner_avatar?: string;
  area: [number, number][][]; // polígono
  center_point: [number, number];
  size_km2: number;
  conquered_at: string;
  last_defended_at?: string;
  conquest_count: number;
  is_protected: boolean;
}

export interface Mission {
  id: string;
  type: 'daily' | 'weekly';
  title: string;
  description: string;
  target_value: number;
  current_progress: number;
  xp_reward: number;
  completed: boolean;
  icon: string;
}

export interface RankingEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  xp_earned: number;
  territories_conquered: number;
  distance_km: number;
  is_current_user?: boolean;
}

export interface FeedPost {
  id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  type: 'activity' | 'conquest' | 'level_up';
  content: string;
  activity?: Activity;
  territory?: Territory;
  level?: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Notification {
  id: string;
  type: 'territory_lost' | 'challenge' | 'friend_request' | 'mission_complete' | 'ranking_update';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export interface Stats {
  total_distance: number;
  total_time: number; // segundos
  total_calories: number;
  avg_speed: number;
  total_activities: number;
  territories_owned: number;
  current_level: number;
  current_xp: number;
  xp_for_next_level: number;
  streak_days: number;
}
