import { StyleSheet, Text, View } from 'react-native';

type SettingsSectionProps = {
	title: string;
	children: React.ReactNode;
};

export default function SettingsSection({
	title,
	children,
}: SettingsSectionProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<View style={styles.content}>{children}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
	},
	title: {
		fontSize: 12,
		color: '#8E8E93',
		textTransform: 'capitalize',
		letterSpacing: 0.2,
		paddingBottom: 12,
	},
	content: {
		borderRadius: 10,
		paddingLeft: 4,
	},
});
