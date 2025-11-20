'use client';

import { useEffect, useRef, useState } from 'react';
import type { Territory } from '@/lib/types';
import { getFriendTerritoryColor } from '@/lib/game-logic';

interface MapViewProps {
  territories: Territory[];
  currentUserId?: string;
  onTerritoryClick?: (territory: Territory) => void;
  center?: [number, number];
  zoom?: number;
}

export default function MapView({
  territories,
  currentUserId,
  onTerritoryClick,
  center = [-23.5505, -46.6333], // São Paulo
  zoom = 13
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  // Simulação de mapa (em produção, usar Mapbox GL JS)
  useEffect(() => {
    // Aqui seria inicializado o Mapbox
    // mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    // const map = new mapboxgl.Map({ ... });
  }, []);

  const handleTerritoryClick = (territory: Territory) => {
    setSelectedTerritory(territory);
    onTerritoryClick?.(territory);
  };

  return (
    <div className="relative w-full h-full bg-[#0A0A0A]">
      {/* Container do mapa */}
      <div ref={mapContainerRef} className="w-full h-full">
        {/* Simulação visual de mapa */}
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
          {/* Grid de fundo (simula mapa) */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-700" />
              ))}
            </div>
          </div>

          {/* Territórios simulados */}
          <div className="absolute inset-0 p-8">
            <div className="grid grid-cols-3 gap-4 w-full h-full">
              {territories.slice(0, 9).map((territory, index) => {
                const isOwned = territory.owner_id === currentUserId;
                const color = isOwned 
                  ? '#FF6B00' 
                  : getFriendTerritoryColor(territory.owner_id);

                return (
                  <button
                    key={territory.id}
                    onClick={() => handleTerritoryClick(territory)}
                    className="relative rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                    style={{
                      backgroundColor: `${color}40`,
                      borderColor: color,
                      boxShadow: isOwned ? `0 0 20px ${color}60` : 'none'
                    }}
                  >
                    {/* Ícone de conquista */}
                    <div className="absolute top-2 right-2">
                      {isOwned ? (
                        <div className="w-6 h-6 rounded-full bg-[#FF6B00] flex items-center justify-center">
                          <span className="text-white text-xs">👑</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: color }}>
                          <span className="text-white text-xs">🏴</span>
                        </div>
                      )}
                    </div>

                    {/* Info do território */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium truncate">
                        {territory.owner_username}
                      </p>
                      <p className="text-gray-300 text-[10px]">
                        {territory.size_km2.toFixed(2)} km²
                      </p>
                    </div>

                    {/* Efeito de proteção */}
                    {territory.is_protected && (
                      <div className="absolute top-2 left-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                          <span className="text-white text-xs">🛡️</span>
                        </div>
                      </div>
                    )}

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legenda */}
          <div className="absolute bottom-4 left-4 bg-[#1A1A1A] rounded-xl p-4 border border-gray-700">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#FF6B00]" />
                <span className="text-white text-sm">Seus territórios</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#3B82F6]" />
                <span className="text-white text-sm">Territórios de amigos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#333333]" />
                <span className="text-white text-sm">Outros territórios</span>
              </div>
            </div>
          </div>

          {/* Contador de territórios */}
          <div className="absolute top-4 right-4 bg-[#1A1A1A] rounded-xl p-4 border border-[#FF6B00]">
            <div className="text-center">
              <p className="text-[#FF6B00] text-2xl font-bold">
                {territories.filter(t => t.owner_id === currentUserId).length}
              </p>
              <p className="text-gray-400 text-xs">Territórios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalhes do território */}
      {selectedTerritory && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTerritory(null)}>
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full border border-gray-700"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white text-xl font-bold">Território</h3>
                <p className="text-gray-400 text-sm">
                  Conquistado por {selectedTerritory.owner_username}
                </p>
              </div>
              <button
                onClick={() => setSelectedTerritory(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Tamanho:</span>
                <span className="text-white font-medium">
                  {selectedTerritory.size_km2.toFixed(2)} km²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Conquistado:</span>
                <span className="text-white font-medium">
                  {new Date(selectedTerritory.conquered_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Conquistas:</span>
                <span className="text-white font-medium">
                  {selectedTerritory.conquest_count}x
                </span>
              </div>
              {selectedTerritory.is_protected && (
                <div className="flex items-center gap-2 bg-blue-500/20 rounded-lg p-3">
                  <span className="text-xl">🛡️</span>
                  <span className="text-blue-400 text-sm">
                    Território protegido por 24h
                  </span>
                </div>
              )}
            </div>

            {selectedTerritory.owner_id !== currentUserId && (
              <button className="w-full mt-6 bg-[#FF6B00] hover:bg-[#CC5500] text-white font-bold py-3 rounded-xl transition-colors">
                Desafiar Dono
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
