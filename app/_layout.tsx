import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ShieldAlert, Globe, Lock } from 'lucide-react-native';
import { db } from '../src/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function RootLayout() {
  const [access, setAccess] = useState<'LOADING' | 'GRANTED' | 'DENIED'>('LOADING');
  const [reason, setReason] = useState('');

  useEffect(() => {
    let unsubSec: () => void;

    const checkSecurity = async () => {
      try {
        // 1. Obtener ubicación del usuario (Simulado/Real)
        const res = await fetch('https://ipapi.co/json/');
        const geo = await res.json();
        const userCountry = geo.country_name;
        const userIp = geo.ip;

        // 2. Escuchar reglas de firewall en tiempo real
        unsubSec = onSnapshot(doc(db, 'platform_settings', 'security'), (snap) => {
          if (snap.exists()) {
            const settings = snap.data();
            
            if (settings.firewallEnabled) {
              const allowed = (settings.allowedCountries || '').split(',').map((c: string) => c.trim().toLowerCase());
              
              // BYPASS DE EMERGENCIA PARA EL ADMIN (Basado en tu IP de la captura)
              if (userIp === '190.106.223.77' || userCountry.toLowerCase().includes('guatemala')) {
                setAccess('GRANTED');
                return;
              }

              if (!allowed.includes(userCountry.toLowerCase())) {
                setAccess('DENIED');
                setReason(`Acceso denegado desde ${userCountry} (${userIp}). Este panel está protegido por geovalla.`);
                return;
              }
            }
          }
          setAccess('GRANTED');
        });
      } catch (e) {
        console.error('Firewall check error:', e);
        setAccess('GRANTED'); // Fallback para no bloquear si la API falla
      }
    };

    checkSecurity();
    return () => unsubSec && unsubSec();
  }, []);

  if (access === 'LOADING') {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 20, color: '#64748B', fontWeight: '600' }}>Iniciando Protocolos de Seguridad...</Text>
      </View>
    );
  }

  if (access === 'DENIED') {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <View style={{ backgroundColor: '#EF444420', padding: 30, borderRadius: 100, marginBottom: 40 }}>
          <ShieldAlert size={80} color="#EF4444" />
        </View>
        <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 16 }}>
          Acceso Prohibido
        </Text>
        <Text style={{ color: '#94A3B8', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 40 }}>
          {reason}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#1E293B', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}>
          <Lock size={16} color="#94A3B8" />
          <Text style={{ color: '#94A3B8', fontWeight: '800', fontSize: 13 }}>FIREWALL TRABBITT ACTIVE</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
