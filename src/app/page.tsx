'use client';

import { useState, useEffect } from 'react';
import { Map, Trophy, User, Search, LogOut } from 'lucide-react';
import { searchPlaces, PlaceSuggestion } from '@/lib/places-api';
import { supabase } from '@/lib/supabase';
import { User as UserType, UserProfile } from '@/lib/types';
import Auth from '@/components/Auth';
import UserQuiz from '@/components/UserQuiz';

type AppState = 'auth' | 'quiz' | 'app';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'ranking' | 'profile'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Verificar se usuário já está logado ao carregar a página
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Buscar dados do usuário
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userData) {
          setCurrentUser(userData);

          // Verificar se já fez o quiz
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (profileData) {
            setUserProfile(profileData);
            setAppState('app');
          } else {
            setAppState('quiz');
          }
        }
      }
    };

    checkUser();
  }, []);

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

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    setAppState('quiz');
  };

  const handleQuizComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setAppState('app');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserProfile(null);
    setAppState('auth');
  };

  if (appState === 'auth') {
    return <Auth onLogin={handleLogin} />;
  }

  if (appState === 'quiz' && currentUser) {
    return <UserQuiz user={currentUser} onComplete={handleQuizComplete} />;
  }

  // App principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4">
        <header className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Conquista de Territórios</h1>
              <p className="text-gray-600">Explore, conquiste e domine o mapa!</p>
              {userProfile && (
                <p className="text-sm text-blue-600 mt-1">
                  Bem-vindo, {userProfile.full_name}!
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
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

          {activeTab === 'profile' && userProfile && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Seu Perfil</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Informações Pessoais</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nome:</span> {userProfile.full_name}</p>
                    <p><span className="font-medium">Idade:</span> {userProfile.age} anos</p>
                    <p><span className="font-medium">Gênero:</span> {userProfile.gender}</p>
                    <p><span className="font-medium">Localização:</span> {userProfile.location}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Atividades</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nível:</span> {userProfile.experience_level}</p>
                    <p><span className="font-medium">Objetivo:</span> {userProfile.goals}</p>
                  </div>
                </div>

                {userProfile.interests.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Interesses</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {userProfile.favorite_sports.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Esportes Favoritos</h3>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.favorite_sports.map((sport, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}