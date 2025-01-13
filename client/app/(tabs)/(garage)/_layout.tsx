import { Stack } from 'expo-router';

import { Locales } from '@/lib';

export default function GarageLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="new-car"
        options={{ title: Locales.t('newCar'), headerShown: false }}
      />
      <Stack.Screen
        name="view-car"
        options={{ title: Locales.t('viewCar'), headerShown: false }}
      />
    </Stack>
  );
}
