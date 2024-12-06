import { Platform } from 'react-native';
import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { MaterialIcons } from '@expo/vector-icons';

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
					title: '',
					tabBarIcon: () => (
						<MaterialIcons
							name='house'
							size={28}
							style={{ paddingTop: 8 }}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='settings'
				options={{
					title: '',
					tabBarIcon: () => (
						<MaterialIcons
							name='settings'
							size={28}
							style={{ paddingTop: 8 }}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
