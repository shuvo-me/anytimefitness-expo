import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input, InputField as GInputField, InputSlot } from '@/components/ui/input';
import React from 'react';

type InputFieldProps = Pick<
  React.ComponentProps<typeof GInputField>,
  | 'value'
  | 'onChangeText'
  | 'onBlur'
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
  onBlur,
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
    <Box className="flex-1">
      <Text className="text-[11px] font-mono text-muted-foreground uppercase">
        {label}
      </Text>
      <Input
        className={`w-full bg-background border-border rounded-xl h-11 ${
          icon ? 'pr-3.5' : 'px-3.5'
        }`}
      >
        {icon && (
          <InputSlot>
            {icon}
          </InputSlot>
        )}
        <GInputField
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines ?? 2 : undefined}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          editable={editable}
          className={`w-full text-sm text-foreground font-mono ${
            multiline ? 'text-xs' : ''
          } ${inputClassName ?? ''}`}
          placeholderTextColor="#666675"
        />
      </Input>
    </Box>
  );
}
