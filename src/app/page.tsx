'use client';

import { useState } from 'react';
import MapView from '@/components/custom/map-view';
import UserProfile from '@/components/custom/user-profile';
import { Play, User, Trophy, Map, Target } from 'lucide-react';
import type { Territory, User as UserType, Mission, Stats } from '@/lib/types';
import { generateDailyMissions } from '@/lib/game-logic';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'map' | 'profile'>('map');

  // Dados simulados (em produção, viriam do Supabase)
  const currentUser: UserType = {
    id: 'user-1',
    username: 'Conquistador',
    level: 12,
    xp: 14800,
    total_distance: 127.5,
    total_activities: 42,
    territories_count: 18,
    premium: false,
    streak_days: 7,
    created_at: new Date().toISOString()
  };

  const stats: Stats = {
    total_distance: 127.5,
    total_time: 36000,
    total_calories: 8500,
    avg_speed: 9.5,
    total_activities: 42,
    territories_owned: 18,
    current_level: 12,
    current_xp: 14800,
    xp_for_next_level: 14400,
    streak_days: 7
  };

  const missions: Mission[] = generateDailyMissions().map((m, i) => ({
    id: `mission-${i}`,
    type: 'daily' as const,
    title: m.title,
    description: m.description,
    target_value: m.target_value,
    current_progress: i === 0 ? m.target_value : Math.floor(m.target_value * 0.6),
    xp_reward: m.xp_reward,
    completed: i === 0,
    icon: m.icon
  }));

  const territories: Territory[] = [
    {
      id: 'territory-1',
      owner_id: 'user-1',
      owner_username: 'Conquistador',
      area: [],
      center_point: [-23.5505, -46.6333],
      size_km2: 0.45,
      conquered_at: new Date().toISOString(),
      conquest_count: 3,
      is_protected: true
    },
    {
      id: 'territory-2',
      owner_id: 'user-1',
      owner_username: 'Conquistador',
      area: [],
      center_point: [-23.5515, -46.6343],
      size_km2: 0.32,
      conquered_at: new Date(Date.now() - 86400000).toISOString(),
      conquest_count: 1,
      is_protected: false
    },
    {
      id: 'territory-3',
      owner_id: 'user-2',
      owner_username: 'João',
      area: [],
      center_point: [-23.5525, -46.6353],
      size_km2: 0.28,
      conquered_at: new Date(Date.now() - 172800000).toISOString(),
      conquest_count: 2,
      is_protected: false
    },
    {
      id: 'territory-4',
      owner_id: 'user-1',
      owner_username: 'Conquistador',
      area: [],
      center_point: [-23.5495, -46.6323],
      size_km2: 0.51,
      conquered_at: new Date(Date.now() - 259200000).toISOString(),
      conquest_count: 4,
      is_protected: false
    },
    {
      id: 'territory-5',
      owner_id: 'user-3',
      owner_username: 'Maria',
      area: [],
      center_point: [-23.5535, -46.6363],
      size_km2: 0.38,
      conquered_at: new Date(Date.now() - 345600000).toISOString(),
      conquest_count: 1,
      is_protected: false
    },
    {
      id: 'territory-6',
      owner_id: 'user-4',
      owner_username: 'Pedro',
      area: [],
      center_point: [-23.5485, -46.6313],
      size_km2: 0.42,
      conquered_at: new Date(Date.now() - 432000000).toISOString(),
      conquest_count: 3,
      is_protected: false
    },
    {
      id: 'territory-7',
      owner_id: 'user-1',
      owner_username: 'Conquistador',
      area: [],
      center_point: [-23.5545, -46.6373],
      size_km2: 0.29,
      conquered_at: new Date(Date.now() - 518400000).toISOString(),
      conquest_count: 2,
      is_protected: false
    },
    {
      id: 'territory-8',
      owner_id: 'user-5',
      owner_username: 'Ana',
      area: [],
      center_point: [-23.5475, -46.6303],
      size_km2: 0.36,
      conquered_at: new Date(Date.now() - 604800000).toISOString(),
      conquest_count: 1,
      is_protected: false
    },
    {
      id: 'territory-9',
      owner_id: 'user-1',
      owner_username: 'Conquistador',
      area: [],
      center_point: [-23.5555, -46.6383],
      size_km2: 0.47,
      conquered_at: new Date(Date.now() - 691200000).toISOString(),
      conquest_count: 5,
      is_protected: false
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#CC5500] flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Conquerix</h1>
              <p className="text-gray-400 text-xs">Domine sua cidade</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-[#0A0A0A] rounded-lg px-3 py-2">
              <Trophy className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-white text-sm font-medium">
                Nível {currentUser.level}
              </span>
            </div>
            <button className="bg-[#FF6B00] hover:bg-[#CC5500] text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span className="hidden sm:inline">Iniciar Corrida</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'map' ? (
          <MapView
            territories={territories}
            currentUserId={currentUser.id}
            onTerritoryClick={(territory) => {
              console.log('Território clicado:', territory);
            }}
          />
        ) : (
          <div className="h-full overflow-y-auto">
            <UserProfile
              user={currentUser}
              stats={stats}
              missions={missions}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-[#1A1A1A] border-t border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'map' ? 'text-[#FF6B00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Map className="w-6 h-6" />
            <span className="text-xs font-medium">Mapa</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Target className="w-6 h-6" />
            <span className="text-xs font-medium">Atividade</span>
          </button>

          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-colors">
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-medium">Ranking</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === 'profile' ? 'text-[#FF6B00]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Perfil</span>
          </button>
        </div>
      </nav>

      {/* Notificação Épica (exemplo) */}
      <div className="fixed top-20 right-4 bg-gradient-to-r from-[#FF6B00] to-[#CC5500] rounded-xl p-4 shadow-2xl max-w-sm animate-in slide-in-from-right duration-500 hidden sm:block">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <h4 className="text-white font-bold">Território Conquistado!</h4>
            <p className="text-white/90 text-sm">
              Você dominou a Avenida Paulista. +150 XP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
