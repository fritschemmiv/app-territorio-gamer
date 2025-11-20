'use client';

import type { User, Mission, Stats } from '@/lib/types';
import { getLevelProgress, getUserTitle, formatDistance } from '@/lib/game-logic';
import { Trophy, Target, Flame, MapPin } from 'lucide-react';

interface UserProfileProps {
  user: User;
  stats: Stats;
  missions: Mission[];
}

export default function UserProfile({ user, stats, missions }: UserProfileProps) {
  const levelProgress = getLevelProgress(user.xp, user.level);
  const title = getUserTitle(user.level);
  const completedMissions = missions.filter(m => m.completed).length;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Header do Perfil */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-700">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#CC5500] flex items-center justify-center text-white text-3xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {/* Info do Usuário */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-white text-2xl font-bold">{user.username}</h2>
              {user.premium && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded">
                  PREMIUM
                </span>
              )}
            </div>
            <p className="text-[#FF6B00] text-sm font-medium mb-2">{title}</p>
            
            {/* Barra de XP */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Nível {user.level}</span>
                <span className="text-gray-400">
                  {user.xp.toLocaleString()} / {stats.xp_for_next_level.toLocaleString()} XP
                </span>
              </div>
              <div className="w-full h-3 bg-[#0A0A0A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B00] to-[#CC5500] transition-all duration-500"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Streak */}
        {user.streak_days > 0 && (
          <div className="mt-4 flex items-center gap-2 bg-[#0A0A0A] rounded-xl p-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-white font-medium">
              {user.streak_days} dias de streak
            </span>
            <span className="text-gray-400 text-sm ml-auto">
              Continue amanhã!
            </span>
          </div>
        )}
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-[#FF6B00]" />
            <span className="text-gray-400 text-sm">Territórios</span>
          </div>
          <p className="text-white text-3xl font-bold">{user.territories_count}</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-[#FF6B00]" />
            <span className="text-gray-400 text-sm">Distância</span>
          </div>
          <p className="text-white text-3xl font-bold">
            {formatDistance(stats.total_distance)}
          </p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-[#FF6B00]" />
            <span className="text-gray-400 text-sm">Atividades</span>
          </div>
          <p className="text-white text-3xl font-bold">{stats.total_activities}</p>
        </div>

        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-[#FF6B00]" />
            <span className="text-gray-400 text-sm">Calorias</span>
          </div>
          <p className="text-white text-3xl font-bold">
            {Math.floor(stats.total_calories / 1000)}k
          </p>
        </div>
      </div>

      {/* Missões Diárias */}
      <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-bold">Missões Diárias</h3>
          <span className="text-gray-400 text-sm">
            {completedMissions}/{missions.length} completas
          </span>
        </div>

        <div className="space-y-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-xl border transition-all ${
                mission.completed
                  ? 'bg-[#00FF8840] border-[#00FF88]'
                  : 'bg-[#0A0A0A] border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{mission.title}</h4>
                  <p className="text-gray-400 text-sm">{mission.description}</p>
                </div>
                {mission.completed && (
                  <span className="text-[#00FF88] text-xl">✓</span>
                )}
              </div>

              {/* Barra de progresso */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">
                    Progresso: {mission.current_progress}/{mission.target_value}
                  </span>
                  <span className="text-[#FF6B00] font-medium">
                    +{mission.xp_reward} XP
                  </span>
                </div>
                <div className="w-full h-2 bg-[#0A0A0A] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      mission.completed
                        ? 'bg-[#00FF88]'
                        : 'bg-gradient-to-r from-[#FF6B00] to-[#CC5500]'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (mission.current_progress / mission.target_value) * 100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      {!user.premium && (
        <div className="bg-gradient-to-r from-[#FF6B00] to-[#CC5500] rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white text-xl font-bold mb-1">
                Desbloqueie Treinos Guiados
              </h3>
              <p className="text-white/90 text-sm">
                Planos personalizados para você evoluir mais rápido
              </p>
            </div>
            <button className="bg-white text-[#FF6B00] font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
              Ver Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
