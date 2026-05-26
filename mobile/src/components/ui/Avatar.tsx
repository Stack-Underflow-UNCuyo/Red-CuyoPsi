import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamily, fontWeight } from '@/constants/typography';

const AVATAR_COLORS = ['#1B3A6B', '#7A2D3B', '#5E7A2E', '#2B5197', '#A0512A', '#3F5C8C'];

export function avatarColor(initials: string): string {
  return AVATAR_COLORS[(initials.charCodeAt(0) || 0) % AVATAR_COLORS.length];
}

export function initialsFromName(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

interface AvatarProps {
  initials: string;
  bg?: string;
  size?: number;
  borderRadius?: number;
  fontSize?: number;
}

export function Avatar({ initials, bg, size = 40, borderRadius, fontSize: fs }: AvatarProps) {
  const background = bg ?? avatarColor(initials);
  const radius = borderRadius ?? size / 2;
  const textSize = fs ?? Math.round(size * 0.38);

  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: radius, backgroundColor: background }]}>
      <Text style={[styles.text, { fontSize: textSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fontFamily.heading,
    fontWeight: fontWeight.bold,
    color: '#FFFFFF',
  },
});
