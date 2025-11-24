import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = React.PropsWithChildren<{
  headerBackgroundColor?: { light?: string; dark?: string } | string;
  headerImage?: React.ReactNode;
}>;

const ParallaxScrollView: React.FC<Props> = ({ headerImage, children }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {headerImage ? <View style={styles.header}>{headerImage}</View> : null}
      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 16 },
  content: {},
});

export default ParallaxScrollView;
