import { Text, TextInput, View } from '@/tw';
import React from 'react';

type InputFieldProps = Pick<
  React.ComponentProps<typeof TextInput>,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'keyboardType'
  | 'multiline'
  | 'numberOfLines'
  | 'secureTextEntry'
  | 'autoCapitalize'
  | 'editable'
> & {
  label: string;
  icon?: React.ReactNode;
  inputClassName?: string;
};

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  icon,
  multiline,
  numberOfLines,
  secureTextEntry,
  autoCapitalize,
  editable,
  inputClassName,
}: InputFieldProps) {
  return (
    <View className="flex-1">
      <Text className="text-[11px] font-mono text-text-muted uppercase">
        {label}
      </Text>
      <View className="flex-row items-center mt-1">
        {icon && <View className="absolute left-3 z-10">{icon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines ?? 2 : undefined}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          editable={editable}
          className={`w-full bg-background border border-border rounded-xl h-11 text-sm text-white font-mono ${
            icon ? 'pl-9 pr-3.5' : 'px-3.5'
          } ${multiline ? 'text-xs resize-none' : ''} ${inputClassName ?? ''}`}
          placeholderTextColor="#666675"
        />
      </View>
    </View>
  );
}
