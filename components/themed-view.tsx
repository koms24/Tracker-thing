import React from 'react';
import { View, ViewProps } from 'react-native';

type Props = ViewProps & {
  children?: React.ReactNode;
};

export const ThemedView: React.FC<Props> = ({ children, style, ...rest }) => {
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
};

export default ThemedView;
