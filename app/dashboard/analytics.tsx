import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BarChart3, TrendingUp, Users, Eye, DollarSign, Star, 
  ChevronLeft, ChevronRight, Filter, Search,
  ArrowUpRight, ArrowDownRight, Activity, PieChart
} from 'lucide-react-native';
import { db } from '../../src/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',
};

export default function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState('Este Mes');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos para analíticas
  useEffect(() => {
    const q = query(collection(db, 'withdrawal_requests'), orderBy('createdAt', 'desc'), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      setWithdrawals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const totalComms = withdrawals.reduce((acc, w) => acc + (w.trabbittFee || 0), 0);
  const totalVolume = totalComms * 10 || 154200;
  const totalReservations = Math.floor(totalVolume / 150) || 842;

  const ANALYTICS_KPIS = [
    { label: 'Volumen Bruto', value: `$ ${totalVolume.toLocaleString()}`, trend: '+12.5%', isPos: true, icon: DollarSign, color: '#3B82F6' },
    { label: 'Comisiones', value: `$ ${totalComms.toLocaleString()}`, trend: '+8.4%', isPos: true, icon: PieChart, color: C.primary },
    { label: 'Reservas Totales', value: totalReservations.toString(), trend: '+4.2%', isPos: true, icon: BarChart3, color: '#6366F1' },
    { label: 'Ticket Promedio', value: `$ ${(totalVolume / (totalReservations || 1)).toFixed(0)}`, trend: '+0.5%', isPos: true, icon: TrendingUp, color: '#F59E0B' },
  ];

const WEEKLY_DATA = [
  { day: 'Lun', value: 45, color: '#E2E8F0' },
  { day: 'Mar', value: 65, color: '#E2E8F0' },
  { day: 'Mié', value: 35, color: '#E2E8F0' },
  { day: 'Jue', value: 85, color: '#E2E8F0' },
  { day: 'Vie', value: 95, color: C.primary },
  { day: 'Sáb', value: 75, color: '#E2E8F0' },
  { day: 'Dom', value: 55, color: '#E2E8F0' },
];

const TOP_PERFORMERS = [
  { id: 1, name: 'Villa de Cristal', region: 'Ciudad de Guatemala', revenue: 'Q 12,450', bookings: 18, rating: 4.9, avatar: 'V' },
  { id: 2, name: 'Loft Skyview', region: 'Antigua Guatemala', revenue: 'Q 9,800', bookings: 12, rating: 4.8, avatar: 'L' },
  { id: 3, name: 'Cabaña del Bosque', region: 'Xela', revenue: 'Q 8,200', bookings: 10, rating: 4.7, avatar: 'C' },
  { id: 4, name: 'Finca El Retiro', region: 'Petén', revenue: 'Q 7,600', bookings: 9, rating: 4.9, avatar: 'F' },
  { id: 5, name: 'Ocean Front', region: 'Monterrico', revenue: 'Q 6,900', bookings: 7, rating: 4.6, avatar: 'O' },
];


  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Analytics</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Rendimiento detallado y métricas de crecimiento.</Text>
        </View>

        {/* Time Range Chips (Small Style) */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Hoy', 'Semana', 'Este Mes', 'Año'].map((label) => {
            const isSel = timeRange === label;
            return (
              <TouchableOpacity 
                key={label}
                onPress={() => setTimeRange(label)}
                style={{
                  paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
                  backgroundColor: isSel ? C.textDark : 'transparent',
                  borderWidth: 1, borderColor: isSel ? C.textDark : '#E2E8F0'
                }}
              >
                <Text style={{ color: isSel ? '#FFFFFF' : C.textMuted, fontSize: 12, fontWeight: '800' }}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ─── Top KPIs grid ─── */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -12, marginBottom: 40 }}>
        {ANALYTICS_KPIS.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <View key={idx} style={{ width: '25%', paddingHorizontal: 12 }}>
              <View style={{
                backgroundColor: C.card, padding: 24, borderRadius: 24,
                shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
                borderWidth: 1, borderColor: C.borderLight
              }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={18} color={kpi.color} strokeWidth={2.5} />
                </View>
                <Text style={{ color: C.textMuted, fontSize: 11, fontWeight: '800', marginBottom: 4 }}>{kpi.label.toUpperCase()}</Text>
                <Text style={{ color: C.textDark, fontSize: 24, fontWeight: '900', marginBottom: 8 }}>{kpi.value}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {kpi.isPos ? <ArrowUpRight size={14} color={C.primary} /> : <ArrowDownRight size={14} color="#EF4444" />}
                  <Text style={{ color: kpi.isPos ? C.primary : '#EF4444', fontSize: 12, fontWeight: '800', marginLeft: 4 }}>{kpi.trend}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Charts Section (Bento) ─── */}
      <View style={{ flexDirection: 'row', gap: 24, marginBottom: 40 }}>
        
        {/* Weekly Revenue Bar Chart */}
        <View style={{ 
          flex: 1.5, backgroundColor: C.card, borderRadius: 32, padding: 32,
          shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
          borderWidth: 1, borderColor: C.borderLight
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: C.textDark }}>Reservas Semanales</Text>
              <Text style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Promedio de 64 reservas por día</Text>
            </View>
            <TouchableOpacity style={{ padding: 10, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
              <Filter size={16} color={C.textMuted} />
            </TouchableOpacity>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 160 }}>
            {WEEKLY_DATA.map((d, i) => (
              <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                <View style={{ position: 'relative', width: '40%', height: d.value, backgroundColor: d.color, borderRadius: 8, overflow: 'hidden' }}>
                    {d.day === 'Vie' && <LinearGradient colors={[C.primary, '#2DD4BF']} style={{ flex: 1 }} />}
                </View>
                <Text style={{ marginTop: 12, fontSize: 12, fontWeight: '700', color: C.textMuted }}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Target Progress Card */}
        <View style={{ 
          flex: 1, backgroundColor: C.textDark, borderRadius: 32, padding: 32,
          shadowColor: '#10B981', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 25, elevation: 10,
        }}>
           <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700', opacity: 0.6, marginBottom: 8 }}>META MENSUAL</Text>
           <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', marginBottom: 20 }}>92% Logrado</Text>
           
           <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 99, marginBottom: 32, overflow: 'hidden' }}>
              <View style={{ width: '92%', height: '100%', backgroundColor: C.primary, borderRadius: 99 }} />
           </View>

           <View style={{ gap: 16 }}>
              {[
                { label: 'Anuncios Nuevos', value: '18/20' },
                { label: 'Hosts Verificados', value: '45/50' },
              ].map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 16 }}>
                   <Text style={{ color: '#FFFFFF', opacity: 0.8, fontSize: 13, fontWeight: '600' }}>{item.label}</Text>
                   <Text style={{ color: C.primary, fontSize: 13, fontWeight: '900' }}>{item.value}</Text>
                </View>
              ))}
           </View>
        </View>
      </View>

      {/* ─── Top Performers Table ─── */}
      <View style={{
        backgroundColor: C.card, borderRadius: 32, padding: 32,
        shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
        borderWidth: 1, borderColor: C.borderLight
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: C.textDark }}>Top Propiedades</Text>
          <TouchableOpacity>
             <Text style={{ color: C.primary, fontWeight: '800', fontSize: 13 }}>Ver reporte completo</Text>
          </TouchableOpacity>
        </View>

        {/* Mini Table Header */}
        <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
          <Text style={{ flex: 2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PROPIEDAD</Text>
          <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>REGIÓN</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>RESERVAS</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>VALORACIÓN</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, textAlign: 'right' }}>INGRESOS</Text>
        </View>

        {/* Filas */}
        {TOP_PERFORMERS.map((item, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: idx === TOP_PERFORMERS.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' }}>
            
            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ fontWeight: '800', fontSize: 12 }}>{item.avatar}</Text>
              </View>
              <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.name}</Text>
            </View>

            <Text style={{ flex: 1.2, color: C.textMuted, fontSize: 13, fontWeight: '600' }}>{item.region}</Text>
            <Text style={{ flex: 1, color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.bookings}</Text>
            
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
               <Star size={12} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 6 }} />
               <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.rating}</Text>
            </View>

            <Text style={{ flex: 1, color: C.primary, fontSize: 14, fontWeight: '900', textAlign: 'right' }}>{item.revenue}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}
