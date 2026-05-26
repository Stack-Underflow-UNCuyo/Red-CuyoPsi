import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';

import { fetchPsychologists } from '@/services/psychologistService';
import { queryKeys } from '@/services/queryKeys';
import type { SearchStackParamList } from '../search.types';

export function useSearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SearchStackParamList>>();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');

  const { data: psychologists, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: queryKeys.psychologists.list(),
    queryFn: fetchPsychologists,
  });

  const handlePressPsychologist = (id: number) => {
    navigation.navigate('PsychologistProfile', { id });
  };

  return {
    psychologists: psychologists ?? [],
    isLoading,
    error,
    isRefreshing: isRefetching,
    onRefresh: refetch,
    handlePressPsychologist,
    query,
    setQuery,
    activeFilter,
    setActiveFilter,
  };
}
