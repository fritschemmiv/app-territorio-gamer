export interface User {
  id: string;
  username: string;
  level: number;
  xp: number;
  total_distance: number;
  total_activities: number;
  territories_count: number;
  premium: boolean;
  streak_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface Territory {
  id: string;
  owner_id: string;
  owner_username: string;
  name?: string;
  size_km2: number;
  center_lat: number;
  center_lng: number;
  boundaries: any;
  conquest_count: number;
  is_protected: boolean;
  conquered_at: string;
  last_defended_at?: string;
}

export interface Activity {
  id: string;
  user_id: string;
  type: 'run' | 'walk' | 'bike';
  distance: number;
  duration: number;
  avg_speed?: number;
  calories?: number;
  route?: any;
  territories_conquered: number;
  xp_earned: number;
  created_at: string;
}

export interface Mission {
  id: string;
  user_id?: string;
  type: 'daily' | 'weekly' | 'special';
  title: string;
  description: string;
  target_value: number;
  current_progress: number;
  xp_reward: number;
  completed: boolean;
  expires_at?: string;
  created_at?: string;
  icon?: string;
}

export interface Stats {
  total_distance: number;
  total_time: number;
  total_calories: number;
  avg_speed: number;
  total_activities: number;
  territories_owned: number;
  current_level: number;
  current_xp: number;
  xp_for_next_level: number;
  streak_days: number;
}
