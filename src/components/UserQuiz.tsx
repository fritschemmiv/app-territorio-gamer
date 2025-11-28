import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, UserProfile } from '@/lib/types';

const quizQuestions: QuizQuestion[] = [
  {
    id: 'full_name',
    question: 'Qual é o seu nome completo?',
    type: 'text',
    required: true,
    placeholder: 'Digite seu nome completo'
  },
  {
    id: 'age',
    question: 'Qual é a sua idade?',
    type: 'number',
    required: true,
    placeholder: 'Digite sua idade'
  },
  {
    id: 'gender',
    question: 'Qual é o seu gênero?',
    type: 'select',
    required: true,
    options: ['Masculino', 'Feminino', 'Outro', 'Prefiro não informar']
  },
  {
    id: 'location',
    question: 'Onde você mora? (Cidade/Estado)',
    type: 'text',
    required: true,
    placeholder: 'Ex: São Paulo/SP'
  },
  {
    id: 'interests',
    question: 'Quais são seus interesses? (Selecione todos que se aplicam)',
    type: 'multiselect',
    required: false,
    options: [
      'Corrida',
      'Ciclismo',
      'Caminhada',
      'Natação',
      'Musculação',
      'Yoga',
      'Pilates',
      'Dança',
      'Artes marciais',
      'Esportes coletivos',
      'Atividades ao ar livre',
      'Fitness em casa'
    ]
  },
  {
    id: 'favorite_sports',
    question: 'Quais esportes você mais gosta de praticar?',
    type: 'multiselect',
    required: false,
    options: [
      'Corrida',
      'Ciclismo',
      'Caminhada',
      'Natação',
      'Futebol',
      'Basquete',
      'Vôlei',
      'Tênis',
      'Golfe',
      'Surfe',
      'Skate',
      'Outro'
    ]
  },
  {
    id: 'experience_level',
    question: 'Qual é o seu nível de experiência em atividades físicas?',
    type: 'select',
    required: true,
    options: [
      'Iniciante (menos de 6 meses)',
      'Intermediário (6 meses a 2 anos)',
      'Avançado (mais de 2 anos)',
      'Profissional/Atleta'
    ]
  },
  {
    id: 'goals',
    question: 'Quais são seus objetivos principais?',
    type: 'select',
    required: true,
    options: [
      'Perder peso',
      'Ganhar massa muscular',
      'Melhorar condicionamento físico',
      'Manter saúde',
      'Preparação para competição',
      'Socializar através do esporte',
      'Reduzir estresse',
      'Outro'
    ]
  }
];

export default function UserQuiz({ user, onComplete }: UserQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const profile: UserProfile = {
        full_name: answers.full_name || '',
        age: parseInt(answers.age) || 0,
        gender: answers.gender || '',
        location: answers.location || '',
        interests: answers.interests || [],
        favorite_sports: answers.favorite_sports || [],
        experience_level: answers.experience_level || '',
        goals: answers.goals || ''
      };

      // Salvar no Supabase
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar perfil:', error);
        alert('Erro ao salvar suas informações. Tente novamente.');
        return;
      }

      onComplete(profile);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = quizQuestions[currentQuestion];
  const currentAnswer = answers[currentQ.id];
  const isAnswered = currentQ.required ? (currentAnswer !== undefined && currentAnswer !== '') : true;

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'text':
        return (
          <input
            type="text"
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
            placeholder={currentQ.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(currentQ.id, parseInt(e.target.value) || '')}
            placeholder={currentQ.placeholder}
            min="1"
            max="120"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'select':
        return (
          <select
            value={currentAnswer || ''}
            onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione uma opção</option>
            {currentQ.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {currentQ.options?.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={currentAnswer?.includes(option) || false}
                  onChange={(e) => {
                    const current = currentAnswer || [];
                    if (e.target.checked) {
                      handleAnswer(currentQ.id, [...current, option]);
                    } else {
                      handleAnswer(currentQ.id, current.filter((item: string) => item !== option));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Conheça você melhor</h1>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} de {quizQuestions.length}
            </span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {currentQ.question}
          </h2>

          {renderQuestion()}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <button
            onClick={handleNext}
            disabled={!isAnswered || isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Salvando...' : currentQuestion === quizQuestions.length - 1 ? 'Finalizar' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
}