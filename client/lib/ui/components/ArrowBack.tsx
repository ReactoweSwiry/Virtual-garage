import { useNavigation } from '@react-navigation/native';
import { StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';

import { Locales } from '@/lib/locales';

interface ArrowBackProps {
  style?: StyleProp<ViewStyle>;
}

const ArrowBack = (props: ArrowBackProps) => {
  const navigation = useNavigation();

  return (
    <Button
      icon="arrow-left"
      mode="contained"
      onPress={() => navigation.goBack()}
      style={props.style}
    >
      {Locales.t('back')}
    </Button>
  );
};

export default ArrowBack;
