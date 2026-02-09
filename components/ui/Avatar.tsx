import React from 'react';
import { View, Text, Image, StyleSheet, ImageStyle, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: AvatarSize;
  style?: StyleProp<ImageStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  style,
}) => {
  const { isDarkMode } = useTheme();

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, fontSize: 14 };
      case 'medium':
        return { width: 48, height: 48, fontSize: 18 };
      case 'large':
        return { width: 64, height: 64, fontSize: 24 };
      case 'xlarge':
        return { width: 96, height: 96, fontSize: 36 };
      default:
        return { width: 48, height: 48, fontSize: 18 };
    }
  };

  const sizeStyle = getSizeStyle();

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarStyle: ImageStyle = {
    width: sizeStyle.width,
    height: sizeStyle.height,
    borderRadius: sizeStyle.width / 2,
  };

  if (source) {
    return (
      <Image
        source={source}
        style={[styles.image, avatarStyle, style]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        avatarStyle,
        styles.placeholder,
        { backgroundColor: isDarkMode ? '#4CAF50' : '#4CAF50' },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: sizeStyle.fontSize }]}>
        {name ? getInitials(name) : '?'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {},
  placeholder: {
    backgroundColor: '#4CAF50',
  },
  initials: {
    color: '#fff',
    fontWeight: '700',
  },
});
