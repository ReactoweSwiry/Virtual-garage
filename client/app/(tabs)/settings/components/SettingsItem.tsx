import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SettingItemProps = {
	icon: keyof typeof Ionicons.glyphMap;
	title: string;
	onPress?: () => void;
};

export default function SettingItem({
	icon,
	title,
	onPress,
}: SettingItemProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={styles.container}>
			<View style={styles.iconContainer}>
				<Ionicons
					name={icon}
					size={20}
					color='#1D3D47'
				/>
			</View>
			<View style={styles.contentContainer}>
				<View style={styles.textContainer}>
					<Text style={styles.title}>{title}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
	},
	iconContainer: {
		width: 40,
		alignItems: 'center',
		paddingTop: 1,
	},
	contentContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	textContainer: {
		flex: 1,
	},
	title: {
		fontSize: 14,
	},
});
