import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';

import SettingItem from '@/components/settings/SettingsItem';
import SettingsSection from '@/components/settings/SettingsSection';
import { Link } from 'expo-router';



export default function Settings() {
	return (
		<ScrollView style={styles.container}>

			<SettingsSection title='Account'>
				<Link href='/settings/profile'>
					<SettingItem
						icon='person-circle'
						title='Profile'
					/>
				</Link>
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
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
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
