import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Surface,
  Avatar,
  Text,
  TextInput,
  Button,
  Card,
  Divider,
  useTheme,
} from 'react-native-paper';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePicture: "https://via.placeholder.com/100",
    bio: "Passionate developer | Coffee enthusiast | Travel lover",
  });

  const [isEditing, setIsEditing] = useState(false);

  const theme = useTheme(); // Access theme properties
  const toggleEdit = () => setIsEditing(!isEditing);

  const handleInputChange = (field, value) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      [field]: value,
    }));
  };

  return (
    <Surface style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        <Avatar.Image
          size={120}
          source={{ uri: profile.profilePicture }}
          style={styles.avatar}
        />
        <Card style={styles.infoCard}>
          <Card.Content>
            {isEditing ? (
              <>
                <TextInput
                  label="Name"
                  mode="outlined"
                  value={profile.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  style={styles.input}
                />
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={profile.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  style={styles.input}
                />
              </>
            ) : (
              <>
                <Text variant="titleLarge" style={styles.name}>
                  {profile.name}
                </Text>
                <Text variant="bodyMedium" style={styles.email}>
                  {profile.email}
                </Text>
              </>
            )}
          </Card.Content>
        </Card>

        <Divider style={styles.divider} />

        <Card style={styles.bioCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.bioTitle}>
              Bio
            </Text>
            {isEditing ? (
              <TextInput
                label="Bio"
                mode="outlined"
                value={profile.bio}
                onChangeText={(text) => handleInputChange('bio', text)}
                multiline
                style={styles.bioInput}
              />
            ) : (
              <Text variant="bodyMedium" style={styles.bioContent}>
                {profile.bio}
              </Text>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={toggleEdit}
          style={styles.editButton}
          labelStyle={styles.editButtonLabel}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 20,
  },
  infoCard: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  name: {
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    textAlign: 'center',
    color: '#666',
  },
  divider: {
    width: '100%',
    marginVertical: 20,
  },
  bioCard: {
    width: '100%',
    marginBottom: 20,
  },
  bioTitle: {
    marginBottom: 10,
  },
  bioContent: {
    lineHeight: 20,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  editButton: {
    marginTop: 20,
    width: '80%',
    borderRadius: 25,
  },
  editButtonLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
