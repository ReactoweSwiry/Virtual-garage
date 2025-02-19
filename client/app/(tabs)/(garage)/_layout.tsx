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
        name="new-action"
        options={{ title: Locales.t('new-action') }}
      />
      <Stack.Screen
        name="update-action"
        options={{ title: Locales.t('update-action') }}
      />
    </Stack>
  );
}
