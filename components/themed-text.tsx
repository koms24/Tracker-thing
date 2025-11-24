import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

type ThemedTextProps = TextProps & {
  type?: 'title' | 'subtitle' | 'defaultSemiBold' | 'default';
  children?: React.ReactNode;
  style?: TextStyle | TextStyle[];
};

export const ThemedText: React.FC<ThemedTextProps> = ({ children, style, ...rest }) => {
  return (
    <Text {...rest} style={style}>
      {children}
    </Text>
  );
};

export default ThemedText;
