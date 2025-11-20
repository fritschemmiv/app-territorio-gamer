export function generateDailyMissions() {
  return [
    {
      title: 'Primeira Corrida',
      description: 'Complete 5 km hoje',
      target_value: 5,
      xp_reward: 100,
      icon: '🏃'
    },
    {
      title: 'Velocista',
      description: 'Mantenha velocidade média acima de 10 km/h',
      target_value: 10,
      xp_reward: 150,
      icon: '⚡'
    },
    {
      title: 'Conquistador',
      description: 'Conquiste 2 novos territórios',
      target_value: 2,
      xp_reward: 200,
      icon: '👑'
    },
    {
      title: 'Maratonista',
      description: 'Acumule 10 km de distância',
      target_value: 10,
      xp_reward: 250,
      icon: '🎯'
    }
  ];
}

export function calculateXP(activity: {
  distance: number;
  duration: number;
  type: 'run' | 'walk' | 'bike';
  territories_conquered: number;
}): number {
  let xp = 0;

  // XP base por distância
  xp += activity.distance * 10;

  // Bônus por tipo de atividade
  const typeMultiplier = {
    run: 1.5,
    bike: 1.2,
    walk: 1.0
  };
  xp *= typeMultiplier[activity.type];

  // Bônus por territórios conquistados
  xp += activity.territories_conquered * 100;

  // Bônus por velocidade (se duração > 0)
  if (activity.duration > 0) {
    const speed = (activity.distance / activity.duration) * 3600; // km/h
    if (speed > 10) xp += 50;
    if (speed > 15) xp += 100;
  }

  return Math.round(xp);
}

export function calculateLevel(xp: number): number {
  // Cada nível requer 1200 XP * nível atual
  let level = 1;
  let totalXpNeeded = 0;

  while (totalXpNeeded + (level * 1200) <= xp) {
    totalXpNeeded += level * 1200;
    level++;
  }

  return level;
}
