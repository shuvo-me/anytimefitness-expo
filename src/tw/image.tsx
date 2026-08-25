import { useCssElement } from 'react-native-css';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Image as RNImage, ImageProps } from 'expo-image';

const AnimatedExpoImage = Animated.createAnimatedComponent(RNImage);

function CSSImage(props: ImageProps) {
  // Remap web-style objectFit/objectPosition styles to expo-image props
  const { objectFit, objectPosition, ...style } = (StyleSheet.flatten(
    props.style,
  ) ?? {}) as Record<string, unknown>;

  return (
    <AnimatedExpoImage
      {...props}
      contentFit={
        (objectFit as ImageProps['contentFit']) ?? props.contentFit ?? 'cover'
      }
      contentPosition={
        (objectPosition as ImageProps['contentPosition']) ??
        props.contentPosition
      }
      source={
        typeof props.source === 'string' ? { uri: props.source } : props.source
      }
      style={style as ImageProps['style']}
    />
  );
}

export const Image = (
  props: React.ComponentProps<typeof CSSImage> & { className?: string },
) => {
  return useCssElement(CSSImage, props, { className: 'style' });
};

Image.displayName = 'CSS(Image)';
