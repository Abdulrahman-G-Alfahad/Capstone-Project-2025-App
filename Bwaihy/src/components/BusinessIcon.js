import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const businesses = {
  'Oula': {
    icon: 'gas-station',
    colors: { background: '#4CAF50', icon: '#fff' },
    iconSet: 'MaterialCommunityIcons',
  },
  'Trolley': {
    icon: 'shopping-cart',
    colors: { background: '#FFA000', icon: '#fff' },
    iconSet: 'FontAwesome',
  },
  'Mishref Co-op': {
    icon: 'store',
    colors: { background: '#2196F3', icon: '#fff' },
    iconSet: 'MaterialCommunityIcons',
  },
};

const BusinessIcon = ({ businessName }) => {
  const business = businesses[businessName] || {
    icon: 'help-circle',
    colors: { background: '#9E9E9E', icon: '#fff' },
    iconSet: 'MaterialCommunityIcons',
  };

  const IconComponent = {
    MaterialCommunityIcons,
    FontAwesome,
    Ionicons,
  }[business.iconSet];

  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: business.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconComponent name={business.icon} size={20} color={business.colors.icon} />
    </View>
  );
};

export default BusinessIcon; 