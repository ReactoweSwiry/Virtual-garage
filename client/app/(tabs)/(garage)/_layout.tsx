import { Stack } from 'expo-router';

import { Locales } from '@/lib';

export default function GarageLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_bottom',
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="new-car"
        options={{ title: Locales.t('newCar') }}
      />
      <Stack.Screen
        name="view-car"
        options={{ title: Locales.t('viewCar') }}
      />
      <Stack.Screen
        name="maintenance"
        options={{ title: Locales.t('maintenance') }}
      />
    </Stack>
  );
}
