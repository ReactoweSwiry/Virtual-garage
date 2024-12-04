import { Image, StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

import SettingItem from '@/components/settings/SettingsItem';
import SettingsSection from '@/components/settings/SettingsSection';

export default function Settings() {
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			headerImage={
				<Image
					source={require('@/assets/images/partial-react-logo.png')}
					style={styles.reactLogo}
				/>
			}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>Settings</Text>
				<Text style={styles.description}>
					Here is your settings panel, tweak it as you like.
				</Text>
			</View>

			<SettingsSection title='Account'>
				<SettingItem
					icon='person-circle'
					title='Profile'
				/>
				<SettingItem
					icon='notifications'
					title='Notifications'
				/>
				<SettingItem
					icon='lock-closed'
					title='Privacy'
				/>
			</SettingsSection>

			<SettingsSection title='Preferences'>
				<SettingItem
					icon='color-palette'
					title='Appearance'
				/>
				<SettingItem
					icon='globe'
					title='Language'
				/>
				<SettingItem
					icon='time'
					title='Time Zone'
				/>
			</SettingsSection>

			<SettingsSection title='Support'>
				<SettingItem
					icon='help-circle'
					title='Help Center'
				/>
				<SettingItem
					icon='document-text'
					title='Terms of Service'
				/>
				<SettingItem
					icon='shield-checkmark'
					title='Privacy Policy'
				/>
			</SettingsSection>

			<SettingsSection title='App Info'>
				<SettingItem
					icon='information-circle'
					title='Version'
				/>
			</SettingsSection>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'column',
		gap: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	description: {
		fontSize: 14,
		fontWeight: 300,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
	},
});
