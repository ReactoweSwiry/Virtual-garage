import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { Appbar, Tooltip } from 'react-native-paper';

import { Locales, TabBar, TabsHeader } from '@/lib';

const TabLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        header: (props) => (
          <TabsHeader navProps={props} children={undefined} />
        ),
      }}
    >
      <Tabs.Screen
        name="(garage)"
        options={{
          title: Locales.t('titleGarage'),
          headerRight: () => (
            <>
              <Tooltip title={Locales.t('search')}>
                <Appbar.Action
                  icon="magnify"
                  onPress={() => router.push('/search')}
                />
              </Tooltip>
            </>
          ),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'home' : 'home-outline'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: Locales.t('titleSettings'),
          tabBarIcon: (props) => (
            <MaterialCommunityIcons
              {...props}
              size={24}
              name={props.focused ? 'cog' : 'cog-outline'}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
