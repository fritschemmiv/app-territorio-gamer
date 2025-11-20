'use client';

import { useState, useEffect } from 'react';
import { Map, Trophy, User, Search } from 'lucide-react';
import { searchPlaces, PlaceSuggestion } from '@/lib/places-api';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'map' | 'ranking' | 'profile'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const response = await searchPlaces(searchQuery);
          setSuggestions(response.suggestions || []);
        } catch (error) {
          console.error('Erro ao buscar lugares:', error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        <header className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Conquista de Territórios</h1>
          <p className="text-gray-600">Explore, conquiste e domine o mapa!</p>
        </header>

        <nav className="bg-white rounded-lg shadow-md p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'map'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Map className="h-5 w-5" />
            <span className="font-medium">Mapa</span>
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'ranking'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Ranking</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'profile'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User className="h-5 w-5" />
            <span className="font-medium">Perfil</span>
          </button>
        </nav>

        <main className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar lugares (ex: Restaurant)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                {suggestions.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => setSearchQuery(suggestion.queryPrediction.text.text)}
                      >
                        <div className="font-medium text-gray-900">
                          {suggestion.queryPrediction.structuredFormat.mainText.text}
                        </div>
                        <div className="text-sm text-gray-500">
                          {suggestion.queryPrediction.text.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm h-96">
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <Map className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Mapa interativo em desenvolvimento</p>
                    <p className="text-sm">Aqui você verá seus territórios conquistados</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Ranking</h2>
              <p className="text-gray-600">Veja os maiores conquistadores!</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Perfil</h2>
              <p className="text-gray-600">Suas conquistas e estatísticas</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
