import { Platform } from 'react-native';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: 'light',
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						position: 'absolute',
					},
					default: {},
				}),
			}}>
			<Tabs.Screen
				name='(garage)'
				options={{
					title: 'Garage',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							name='house.fill'
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='settings'
				options={{
					title: 'Settings',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							name='star.fill' //Change to settings
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
