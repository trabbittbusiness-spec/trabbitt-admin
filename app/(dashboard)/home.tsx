import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, 
  Dimensions, Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Users, Building2, CreditCard, TrendingUp, 
  TrendingDown, ArrowUpRight, Bell, Menu,
  ChevronRight, CheckCircle, XCircle, Clock,
  DollarSign, Home, Camera, Eye, Star,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// ─────────────────────────────────────────────────
// DATA MOCK
// ─────────────────────────────────────────────────
const KPI_CARDS = [
  {
    label: 'Reservas Totales',
    value: '1,284',
    change: '+12.5%',
    up: true,
    icon: Home,
    color: '#00BFA5',
    bg: 'rgba(0,191,165,0.12)',
  },
  {
    label: 'Usuarios Activos',
    value: '3,872',
    change: '+8.1%',
    up: true,
    icon: Users,
    color: '#818CF8',
    bg: 'rgba(129,140,248,0.12)',
  },
  {
    label: 'Ingresos del Mes',
    value: 'Q 48,320',
    change: '+21.3%',
    up: true,
    icon: DollarSign,
    color: '#34D399',
    bg: 'rgba(52,211,153,0.12)',
  },
  {
    label: 'Cancelaciones',
    value: '34',
    change: '-3.2%',
    up: false,
    icon: XCircle,
    color: '#F87171',
    bg: 'rgba(248,113,113,0.12)',
  },
];

const RECENT_ACTIVITY = [
  { id: '1', type: 'booking', label: 'Nueva reserva - Villa de Cristal', user: 'Patricia M.', time: 'hace 5 min', status: 'confirmed' },
  { id: '2', type: 'withdrawal', label: 'Solicitud de retiro', user: 'Carlos R.', time: 'hace 18 min', status: 'pending' },
  { id: '3', type: 'listing', label: 'Nuevo anuncio en revisión', user: 'Ana G.', time: 'hace 1h', status: 'review' },
  { id: '4', type: 'booking', label: 'Reserva confirmada - Cabaña del Bosque', user: 'Luis T.', time: 'hace 2h', status: 'confirmed' },
  { id: '5', type: 'withdrawal', label: 'Retiro aprobado', user: 'María S.', time: 'hace 3h', status: 'approved' },
];

const QUICK_STATS = [
  { label: 'Anuncios pendientes', value: '18', icon: Camera, color: '#FBBF24' },
  { label: 'Retiros pendientes', value: '7', icon: CreditCard, color: '#F87171' },
  { label: 'Owners activos', value: '142', icon: Star, color: '#818CF8' },
  { label: 'Visitas hoy', value: '2,341', icon: Eye, color: '#34D399' },
];

// ─────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────
function KpiCard({ item }: { item: typeof KPI_CARDS[0] }) {
  const Icon = item.icon;
  return (
    <View
      className="rounded-3xl p-5"
      style={{
        backgroundColor: '#131320',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.07)',
        minWidth: 200,
        flex: 1,
      }}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="rounded-2xl p-3" style={{ backgroundColor: item.bg }}>
          <Icon size={20} color={item.color} strokeWidth={2} />
        </View>
        <View className="flex-row items-center rounded-full px-2.5 py-1"
          style={{ backgroundColor: item.up ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)' }}
        >
          {item.up 
            ? <TrendingUp size={11} color="#34D399" strokeWidth={2.5} />
            : <TrendingDown size={11} color="#F87171" strokeWidth={2.5} />
          }
          <Text className="ml-1 font-bold text-[10px]"
            style={{ color: item.up ? '#34D399' : '#F87171' }}>
            {item.change}
          </Text>
        </View>
      </View>
      <Text className="text-3xl font-black text-white mb-1">{item.value}</Text>
      <Text className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</Text>
    </View>
  );
}

function ActivityRow({ item }: { item: typeof RECENT_ACTIVITY[0] }) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    confirmed: { color: '#34D399', label: 'Confirmado' },
    pending: { color: '#FBBF24', label: 'Pendiente' },
    review: { color: '#818CF8', label: 'En revisión' },
    approved: { color: '#00BFA5', label: 'Aprobado' },
  };
  const s = statusConfig[item.status];

  return (
    <View className="flex-row items-center py-4 border-b"
      style={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}
    >
      <View className="w-9 h-9 rounded-full mr-4 items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
      >
        <Text className="text-white font-bold text-sm">{item.user[0]}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-white font-semibold text-sm mb-0.5" numberOfLines={1}>{item.label}</Text>
        <Text className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.user} · {item.time}</Text>
      </View>
      <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: `${s.color}18` }}>
        <Text className="font-bold text-[10px]" style={{ color: s.color }}>{s.label}</Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────
// SCREEN
// ─────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const isWide = Platform.OS === 'web' && width >= 768;

  return (
    <View className="flex-1" style={{ backgroundColor: '#0A0A0F' }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: isWide ? 32 : 20, paddingBottom: 100 }}
      >
        {/* Top Bar */}
        <View className="flex-row justify-between items-center mb-10">
          <View>
            <Text className="text-white font-black text-2xl">Dashboard</Text>
            <Text className="text-xs font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Domingo, 20 de Abril 2025
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              className="w-10 h-10 rounded-full items-center justify-center relative"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
            >
              <Bell size={18} color="rgba(255,255,255,0.7)" strokeWidth={2} />
              <View className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
            </TouchableOpacity>
          </View>
        </View>

        {/* KPI Cards Row */}
        <Text className="text-xs font-black uppercase tracking-widest mb-5"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          Resumen General
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingRight: 20 }}
          className="mb-10 -mx-1"
        >
          {KPI_CARDS.map((kpi, i) => <KpiCard key={i} item={kpi} />)}
        </ScrollView>

        {/* Quick Stats */}
        <Text className="text-xs font-black uppercase tracking-widest mb-5"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          Estado Rápido
        </Text>
        <View className="flex-row flex-wrap gap-3 mb-10">
          {QUICK_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <View 
                key={i}
                className="flex-row items-center rounded-2xl px-4 py-3 flex-1"
                style={{ 
                  minWidth: 140,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.06)',
                }}
              >
                <Icon size={16} color={stat.color} strokeWidth={2} />
                <Text className="ml-3 font-bold text-white text-base">{stat.value}</Text>
                <Text className="ml-2 text-xs flex-1" style={{ color: 'rgba(255,255,255,0.4)' }} numberOfLines={1}>
                  {stat.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Recent Activity */}
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-xs font-black uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            Actividad Reciente
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-xs font-bold" style={{ color: '#00BFA5' }}>Ver todo</Text>
            <ChevronRight size={14} color="#00BFA5" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <View
          className="rounded-3xl p-5"
          style={{ 
            backgroundColor: '#131320',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          {RECENT_ACTIVITY.map(item => <ActivityRow key={item.id} item={item} />)}
        </View>
      </ScrollView>
    </View>
  );
}
