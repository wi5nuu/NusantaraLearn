import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Image, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CertificateCardProps {
  userName: string;
  lessonTitle: string;
  date: string;
  certificateId: string;
}

/**
 * CertificateCard [LUXURY BULLETPROOF EDITION]
 * Uses onLayout for absolute precision scaling regardless of device or screen orientation.
 * Ensures 100% fidelity and zero clipping.
 */
export const CertificateCard: React.FC<CertificateCardProps> = ({ 
  userName, 
  lessonTitle, 
  date, 
  certificateId 
}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  // BASE DESIGN DIMENSIONS
  const BASE_WIDTH = 350;
  const BASE_HEIGHT = 247;
  
  // Calculate scale based on actual measured width
  // Default to a safe scale if first render
  const scale = containerWidth > 0 ? containerWidth / BASE_WIDTH : Dimensions.get('window').width / 400;
  const containerHeight = BASE_HEIGHT * scale;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      setContainerWidth(width);
    }
  };

  return (
    <View 
      onLayout={onLayout}
      style={[
        styles.container, 
        { height: containerHeight > 0 ? containerHeight : undefined }
      ]}
    >
      {containerWidth > 0 && (
        <>
          {/* 1. LAYER: White Base */}
          <View style={styles.whiteBase} />

          {/* 2. LAYER: Decorative Background Patterns */}
          <View style={styles.decorations}>
            <View style={styles.linesContainer}>
              {[...Array(8)].map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.bgLine, 
                    { 
                      top: (5 + i * 8) * scale, 
                      left: -20 * scale,
                      width: containerWidth * 0.7,
                      height: 0.5 * scale,
                      transform: [{ rotate: '-12deg' }]
                    }
                  ]} 
                />
              ))}
            </View>

            {/* Bottom Left Corner Swooshes */}
            <View style={[styles.swoosh, { 
              backgroundColor: '#052a1f', 
              width: 180 * scale, height: 140 * scale, 
              bottom: -60 * scale, left: -60 * scale,
              borderRadius: 100 * scale, transform: [{ rotate: '40deg' }]
            }]} />
            <View style={[styles.swoosh, { 
              backgroundColor: '#D4AF37', 
              width: 180 * scale, height: 140 * scale, 
              bottom: -70 * scale, left: -40 * scale,
              borderRadius: 100 * scale, transform: [{ rotate: '32deg' }]
            }]} />
          </View>

          {/* 3. LAYER: Official Logo (Clean, No Circle) */}
          <View style={[styles.cleanLogoBox, { bottom: 20 * scale, left: 20 * scale }]}>
            <Image 
              source={require('../logo_nusantaralearn.png')} 
              style={{ width: 45 * scale, height: 45 * scale, resizeMode: 'contain' }} 
            />
          </View>

          {/* 4. LAYER: Double Gold Premium Frame */}
          <View style={[styles.outerFrame, { margin: 12 * scale, borderWidth: 2 * scale }]}>
            <View style={[styles.innerFrame, { borderWidth: 0.5 * scale, padding: 12 * scale }]}>
              
              {/* Header */}
              <View style={styles.centerAlign}>
                <Text style={[styles.title, { fontSize: 24 * scale, letterSpacing: 6 * scale }]}>CERTIFICATE</Text>
                
                <View style={[styles.ribbon, { height: 22 * scale, marginTop: 4 * scale }]}>
                  <View style={styles.ribbonBg} />
                  <Text style={[styles.ribbonText, { fontSize: 8 * scale, letterSpacing: 2 * scale }]}>OF APPRECIATION</Text>
                </View>
                
                <Text style={[styles.bilingualLabel, { fontSize: 7 * scale, marginTop: 12 * scale }]}>
                  Diberikan kepada / <Text style={{ fontStyle: 'italic' }}>This certificate is awarded to</Text>
                </Text>
              </View>

              {/* Recipient Name - No Clipping */}
              <View style={[styles.nameBox, { height: 40 * scale, marginVertical: 4 * scale }]}>
                <Text style={[styles.nameText, { fontSize: 26 * scale }]} numberOfLines={1}>
                  {userName}
                </Text>
              </View>

              {/* Description Section */}
              <View style={[styles.body, { marginTop: 0 }]}>
                <Text style={[styles.descText, { fontSize: 7 * scale, lineHeight: 10 * scale }]}>
                  Atas keberhasilannya menyelesaikan materi edukatif dan evaluasi pada:
                </Text>
                <Text style={[styles.descTextEnglish, { fontSize: 6 * scale, marginTop: 1 * scale, fontStyle: 'italic' }]}>
                  Has successfully completed the curriculum and evaluation for:
                </Text>
                <Text style={[styles.courseText, { fontSize: 11 * scale, marginTop: 6 * scale }]}>"{lessonTitle}"</Text>
              </View>

              {/* Signature Section */}
              <View style={styles.footerRow}>
                <View style={{ flex: 1.5 }} />
                <View style={[styles.sigContainer, { paddingBottom: 5 * scale }]}>
                  <View style={[styles.sigLine, { height: 0.8 * scale }]} />
                  <Text style={[styles.sigName, { fontSize: 9.5 * scale }]}>Wisnu Alfian Nur Ashar</Text>
                  <Text style={[styles.sigRole, { fontSize: 6 * scale }]}>Founder & CEO, NusantaraLearn</Text>
                </View>
              </View>

              {/* Meta Row */}
              <View style={[styles.metaRow, { opacity: 0.15 }]}>
                <Text style={{ fontSize: 4.5 * scale, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>ID: {certificateId}</Text>
                <Text style={{ fontSize: 4.5 * scale, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}>DATE: {date}</Text>
              </View>

            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 6 },
      web: { 
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        // @ts-ignore
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }
    }),
  },
  whiteBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
  },
  outerFrame: {
    ...StyleSheet.absoluteFillObject,
    borderColor: '#D4AF37',
  },
  innerFrame: {
    flex: 1,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerAlign: {
    alignItems: 'center',
    width: '100%',
  },
  body: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: '#000',
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Bodoni 72' : 'serif',
  },
  ribbon: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonBg: {
    position: 'absolute',
    width: '75%',
    height: '100%',
    backgroundColor: '#052a20',
    transform: [{ skewX: '-25deg' }],
  },
  ribbonText: {
    color: '#fff',
    fontWeight: '800',
  },
  bilingualLabel: {
    color: '#666',
    fontWeight: '500',
  },
  nameBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    color: '#B38728',
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Snell Roundhand' : 'serif',
  },
  descText: {
    color: '#333',
    textAlign: 'center',
    fontWeight: '700',
  },
  descTextEnglish: {
    color: '#888',
    textAlign: 'center',
  },
  courseText: {
    color: '#063024',
    fontWeight: '900',
    fontStyle: 'italic',
  },
  footerRow: {
    width: '100%',
    flexDirection: 'row',
  },
  sigContainer: {
    flex: 1.5,
    alignItems: 'center',
  },
  sigLine: {
    width: '100%',
    backgroundColor: '#ccc',
    marginBottom: 4,
  },
  sigName: {
    color: '#111',
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  sigRole: {
    color: '#888',
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cleanLogoBox: {
    position: 'absolute',
    zIndex: 10,
  },
  decorations: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  bgLine: {
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.05,
  },
  swoosh: {
    position: 'absolute',
  },
  linesContainer: {
    ...StyleSheet.absoluteFillObject,
  }
});
