import { Link as RouterLink } from 'expo-router';
import React from 'react';
import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from 'react-native-css';

export {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native-css/components';

type WithClassName<T> = T & { className?: string };

// CSS Variable hook — on web, CSS var() strings work natively
export const useCSSVariable =
  process.env.EXPO_OS !== 'web'
    ? useFunctionalVariable
    : (_variable: string) => `var(${_variable})`;

// CSS-enabled Link
// (casts avoid TS2590 from expo-router's deeply-nested href prop unions)
const LinkBase = RouterLink as unknown as React.FunctionComponent<
  Record<string, unknown> & { children?: React.ReactNode }
>;

function CSSLink(props: React.ComponentProps<typeof RouterLink>) {
  return useCssElement(LinkBase, props, { className: 'style' });
}

export const Link = (
  props: WithClassName<React.ComponentProps<typeof CSSLink>>,
) => {
  return <CSSLink {...props} />;
};

Link.Trigger = RouterLink.Trigger;
Link.Menu = RouterLink.Menu;
Link.MenuAction = RouterLink.MenuAction;
Link.Preview = RouterLink.Preview;
