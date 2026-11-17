import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { colors } from '../../lib/theme';
import { FREE_DAILY_LIMIT } from '../../lib/usage';

type Step = 'camera' | 'captured' | 'solving' | 'answer';
const LIMIT_MESSAGE = `You have used all ${FREE_DAILY_LIMIT} free scans for today.\n\nYour scans reset tomorrow. Premium with unlimited scans is coming soon.`;
const FRIENDLY_ERROR =
  'Sorry, we could not solve this question. Check your internet and try again, or retake a clearer picture.';

export default function Scan() {
  const insets = useSafeAreaInsets();
  const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [step, setStep] = useState<Step>('camera');
  const [photo, setPhoto] = useState<string | null>(null);
  const [torch, setTorch] = useState(false);
  const [solution, setSolution] = useState('');
  const [left, setLeft] = useState<number | null>(null);

  // refresh the count whenever this tab is opened
  

  const usageText = left === null ? '' : `${left} of ${FREE_DAILY_LIMIT} free scans left today`;

  async function takePicture() {
    const pic = await camera.current?.takePictureAsync({ quality: 0.5 });
    if (pic?.uri) {
      setPhoto(pic.uri);
      setStep('captured');
    }
  }

  async function pickFromGallery() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
    if (!res.canceled) {
      setPhoto(res.assets[0].uri);
      setStep('captured');
    }
  }

     async function solveNow() {
    if (!photo) return;

    // no scans left: skip the upload and say so straight away
    if (left === 0) {
      setSolution(LIMIT_MESSAGE);
      setStep('answer');
      return;
    }

    setStep('solving');
    try {
      // shrink the picture so it uploads fast on a weak connection
      const small = await ImageManipulator.manipulateAsync(
        photo,
        [{ resize: { width: 1024 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      const { data, error } = await supabase.functions.invoke('solve', {
        body: { imageBase64: small.base64, mediaType: 'image/jpeg' },
      });

      if (error) throw error;
      if (!data?.solution) throw new Error(data?.error ?? 'No answer');

      setSolution(data.solution);
      if (typeof data.remaining === 'number') setLeft(data.remaining);
    } catch (e: any) {
      let body: any = null;
      try {
        body = await e?.context?.json?.();
      } catch {
        // no extra details available
      }

      if (body?.error === 'limit') {
        setLeft(0);
        setSolution(LIMIT_MESSAGE);
      } else if (body?.error === 'login') {
        setSolution('Your login has expired. Please log out and log in again.');
      } else {
        console.warn('Solve failed:', body?.error ?? e?.message); // for you, not the student
        setSolution(FRIENDLY_ERROR);
      }
    }
    setStep('answer');
  }

  async function shareAnswer() {
    try {
      await Share.share({ message: 'Solved with Pathway\n\n' + solution });
    } catch {
      // sharing was cancelled
    }
  }

  const header = (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingTop: insets.top + 12,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {(step === 'captured' || step === 'answer') && (
        <Pressable
          accessibilityLabel="Go back"
          onPress={() => setStep(step === 'answer' ? 'captured' : 'camera')}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#3B57A8',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </Pressable>
      )}
      <Text style={{ fontSize: 19, fontWeight: '700', color: '#FFFFFF' }}>Scan to solve</Text>
    </View>
  );

  // 1. Waiting for the permission answer
  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: colors.background }}>{header}</View>;
  }

  // 2. Allow camera card
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
        <StatusBar style="light" />
        {header}
        <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: 24,
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.iconBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="camera-outline" size={32} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>Allow camera access</Text>
            <Text style={{ fontSize: 15, lineHeight: 22, textAlign: 'center', color: colors.muted }}>
              Pathway needs your camera to take a picture of the question you want solved.
            </Text>
            <View style={{ alignSelf: 'stretch' }}>
              <Button label="Allow camera" onPress={requestPermission} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 3. Live camera
  if (step === 'camera') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
        <StatusBar style="light" />
        {header}
        <View style={{ flex: 1 }}>
          <CameraView ref={camera} style={{ flex: 1 }} facing="back" enableTorch={torch} />
          <View
            style={[
              StyleSheet.absoluteFill,
              { alignItems: 'center', justifyContent: 'space-between', paddingVertical: 24 },
            ]}
            pointerEvents="box-none"
          >
                        <View style={{ alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>
                Place the question inside the frame
              </Text>
              {usageText !== '' && (
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: colors.accentText,
                    backgroundColor: '#FFEDD5',
                    borderRadius: 999,
                    paddingHorizontal: 12,
                    paddingVertical: 3,
                    overflow: 'hidden',
                  }}
                >
                  {usageText}
                </Text>
              )}
            </View>
            <View
              style={{
                width: 300,
                height: 360,
                borderRadius: 16,
                borderWidth: 3,
                borderColor: 'rgba(255,255,255,0.85)',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: 300,
              }}
            >
              <Pressable onPress={pickFromGallery} accessibilityLabel="Choose from gallery" style={sideButton}>
                <Ionicons name="images-outline" size={22} color="#FFFFFF" />
              </Pressable>
              <Pressable
                onPress={takePicture}
                accessibilityLabel="Take picture"
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 39,
                  borderWidth: 5,
                  borderColor: '#FFFFFF',
                  backgroundColor: colors.accent,
                }}
              />
              <Pressable onPress={() => setTorch(!torch)} accessibilityLabel="Flash" style={sideButton}>
                <Ionicons name={torch ? 'flash' : 'flash-outline'} size={22} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 4. Picture captured
  if (step === 'captured') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B1220' }}>
        <StatusBar style="light" />
        {header}
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
          {photo && (
            <Image
              source={{ uri: photo }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              resizeMode="contain"
            />
          )}
        </View>
                <View style={{ backgroundColor: '#FFFFFF', padding: 16, gap: 12 }}>
          {usageText !== '' && (
            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600', color: colors.muted }}>
              {usageText}
            </Text>
          )}
          <Button label="Solve now" onPress={solveNow} />
      </View>
      </View>
    );
  }

  // 5. Solving
  if (step === 'solving') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        {header}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Solving your question</Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>This takes a few seconds</Text>
        </View>
      </View>
    );
  }

  // 6. Answer
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      {header}

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, flexGrow: 1 }}>
        {photo && (
          <View
            style={{
              alignSelf: 'flex-end',
              backgroundColor: colors.primary,
              borderRadius: 14,
              padding: 6,
            }}
          >
            <Image
              source={{ uri: photo }}
              style={{ width: 150, height: 100, borderRadius: 10 }}
              resizeMode="cover"
            />
          </View>
        )}

        <View
          style={{
            flexGrow: 1,
            minHeight: 360,
            backgroundColor: '#FFFFFF',
            borderWidth: 2,
            borderColor: colors.border,
            borderRadius: 20,
            padding: 20,
            gap: 12,
          }}
        >
          <Text
            style={{
              alignSelf: 'flex-start',
              fontSize: 13,
              fontWeight: '700',
              color: colors.accentText,
              backgroundColor: '#FFEDD5',
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 3,
              overflow: 'hidden',
            }}
          >
            AI solution
          </Text>
          <Text selectable style={{ fontSize: 18, lineHeight: 28, color: colors.text }}>
            {solution}
          </Text>
        </View>
      </ScrollView>

      {/* Only two buttons */}
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Button
            label="Scan another"
            variant="secondary"
            onPress={() => {
              setPhoto(null);
              setSolution('');
              setStep('camera');
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button label="Share" onPress={shareAnswer} />
        </View>
      </View>
    </View>
  );
}

const sideButton = {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: 'rgba(0,0,0,0.45)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

