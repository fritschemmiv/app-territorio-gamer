// Lógica de gamificação do Conquerix

import type { Activity, ActivityType } from './types';

/**
 * Calcula XP ganho em uma atividade
 */
export const calculateXP = (activity: Partial<Activity>): number => {
  let xp = 0;
  
  // Base: distância (10 XP por km)
  if (activity.distance) {
    xp += Math.floor(activity.distance * 10);
  }
  
  // Bônus: velocidade (corrida rápida > 10 km/h)
  if (activity.type === 'run' && activity.avg_speed && activity.avg_speed > 10) {
    xp += 50;
  }
  
  // Bônus: ciclismo rápido (> 25 km/h)
  if (activity.type === 'bike' && activity.avg_speed && activity.avg_speed > 25) {
    xp += 75;
  }
  
  // Bônus: territórios conquistados (100 XP cada)
  if (activity.territories_conquered) {
    xp += activity.territories_conquered * 100;
  }
  
  return Math.floor(xp);
};

/**
 * Calcula nível baseado no XP total
 */
export const getLevelFromXP = (xp: number): number => {
  // Progressão exponencial suave: level = sqrt(xp / 100) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

/**
 * Calcula XP necessário para próximo nível
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  // XP necessário = level² * 100
  return Math.pow(currentLevel, 2) * 100;
};

/**
 * Calcula XP total necessário para um nível específico
 */
export const getTotalXPForLevel = (level: number): number => {
  return Math.pow(level - 1, 2) * 100;
};

/**
 * Calcula progresso percentual para próximo nível
 */
export const getLevelProgress = (currentXP: number, currentLevel: number): number => {
  const xpForCurrentLevel = getTotalXPForLevel(currentLevel);
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  
  return Math.floor((xpInCurrentLevel / xpForNextLevel) * 100);
};

/**
 * Calcula calorias queimadas (estimativa)
 */
export const calculateCalories = (
  distance: number, // km
  duration: number, // segundos
  type: ActivityType,
  weight: number = 70 // kg (padrão)
): number => {
  const hours = duration / 3600;
  
  // MET (Metabolic Equivalent of Task) values
  const metValues = {
    walk: 3.5,
    run: 8.0,
    bike: 6.0
  };
  
  const met = metValues[type];
  const calories = met * weight * hours;
  
  return Math.floor(calories);
};

/**
 * Formata duração em segundos para string legível
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
};

/**
 * Formata distância em km
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.floor(km * 1000)}m`;
  }
  return `${km.toFixed(2)}km`;
};

/**
 * Formata velocidade
 */
export const formatSpeed = (kmh: number): string => {
  return `${kmh.toFixed(1)} km/h`;
};

/**
 * Calcula pace (min/km) a partir de velocidade
 */
export const calculatePace = (kmh: number): string => {
  if (kmh === 0) return '--:--';
  const minPerKm = 60 / kmh;
  const minutes = Math.floor(minPerKm);
  const seconds = Math.floor((minPerKm - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Gera missões diárias aleatórias
 */
export const generateDailyMissions = (): Array<{
  title: string;
  description: string;
  target_value: number;
  xp_reward: number;
  icon: string;
  type: 'distance' | 'speed' | 'territory' | 'time';
}> => {
  const missions = [
    {
      title: 'Corrida Matinal',
      description: 'Corra 3 km hoje',
      target_value: 3,
      xp_reward: 100,
      icon: 'Sunrise',
      type: 'distance' as const
    },
    {
      title: 'Conquistador',
      description: 'Conquiste 2 territórios',
      target_value: 2,
      xp_reward: 150,
      icon: 'Flag',
      type: 'territory' as const
    },
    {
      title: 'Velocista',
      description: 'Atinja 12 km/h de velocidade média',
      target_value: 12,
      xp_reward: 120,
      icon: 'Zap',
      type: 'speed' as const
    },
    {
      title: 'Resistência',
      description: 'Corra por 30 minutos',
      target_value: 30,
      xp_reward: 130,
      icon: 'Timer',
      type: 'time' as const
    },
    {
      title: 'Explorador',
      description: 'Percorra 5 km em qualquer atividade',
      target_value: 5,
      xp_reward: 150,
      icon: 'Compass',
      type: 'distance' as const
    }
  ];
  
  // Retorna 3 missões aleatórias
  return missions.sort(() => Math.random() - 0.5).slice(0, 3);
};

/**
 * Mensagens motivacionais para notificações
 */
export const getMotivationalMessage = (type: 'morning' | 'evening' | 'territory_lost' | 'ranking'): string => {
  const messages = {
    morning: [
      '☀️ Bom dia, conquistador! Sua cidade te espera.',
      '🔥 Hora de dominar! Que territórios você vai tomar hoje?',
      '💪 Novo dia, novas conquistas. Vamos lá!',
      '🏃 A cidade é sua. Prove isso hoje.'
    ],
    evening: [
      '🌆 Hora do rush. Que tal dominar a avenida no caminho pra casa?',
      '🔥 Seu território não se defende sozinho. Corra agora!',
      '💪 Termine o dia com uma conquista épica.',
      '🏃 Última chance de subir no ranking hoje!'
    ],
    territory_lost: [
      '🚨 Alguém tomou seu território! Vai deixar?',
      '⚠️ Território perdido! Hora da reconquista.',
      '💥 Você foi desafiado! Mostre quem manda.',
      '🔥 Seu território foi invadido. Defenda agora!'
    ],
    ranking: [
      '📈 Você está subindo! Continue assim.',
      '📉 Cuidado! Você caiu no ranking. Recupere sua posição!',
      '🏆 Você está no Top 10! Mantenha o ritmo.',
      '⚡ Falta pouco para o Top 5. Corra mais!'
    ]
  };
  
  const options = messages[type];
  return options[Math.floor(Math.random() * options.length)];
};

/**
 * Calcula tamanho de território baseado na distância percorrida
 */
export const calculateTerritorySize = (distance: number): number => {
  // Buffer em metros ao redor da rota
  // Quanto maior a distância, maior o buffer
  const baseBuffer = 50; // metros
  const maxBuffer = 200; // metros
  
  // Progressão logarítmica
  const buffer = Math.min(
    maxBuffer,
    baseBuffer + Math.log(distance + 1) * 30
  );
  
  return buffer;
};

/**
 * Detecta se território está protegido (defendido nas últimas 24h)
 */
export const isTerritoryProtected = (lastDefendedAt?: string): boolean => {
  if (!lastDefendedAt) return false;
  
  const now = new Date();
  const defended = new Date(lastDefendedAt);
  const hoursSinceDefense = (now.getTime() - defended.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceDefense < 24;
};

/**
 * Calcula título do usuário baseado no nível
 */
export const getUserTitle = (level: number): string => {
  if (level < 10) return 'Iniciante';
  if (level < 25) return 'Explorador';
  if (level < 50) return 'Conquistador';
  if (level < 75) return 'Dominador';
  if (level < 100) return 'Lenda';
  return 'Imperador';
};

/**
 * Gera cor para território de amigo (baseado em user_id)
 */
export const getFriendTerritoryColor = (userId: string): string => {
  const colors = [
    '#3B82F6', // azul
    '#10B981', // verde
    '#8B5CF6', // roxo
    '#F59E0B', // amarelo
    '#EF4444', // vermelho
    '#06B6D4', // cyan
    '#EC4899', // pink
  ];
  
  // Hash simples do userId para escolher cor consistente
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
