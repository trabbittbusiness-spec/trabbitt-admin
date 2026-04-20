import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp, Users, Calendar, AlertCircle,
  ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Activity,
  Clock, DollarSign, Wallet, Headphones, SearchCheck, CreditCard,
  Percent, PieChart, Ticket
} from 'lucide-react-native';

// ─── Theme: Startup Dashboard Content ────────────────
const C = {
  bg: '#FFFFFF',            // Pure White Background
  card: '#FFFFFF',          // Cards are also white (separated by soft shadows)
  primary: '#10B981',       // Emerald
  mint: '#2DD4BF',          // Mint
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',   // Very soft inner borders
};

// ─── Dummy Data ──────────────────────────────────────
const KPIS = [
  { id: 1, title: 'Reservas Activas', value: '1,284', trend: '+12.5%', isPositive: true, icon: Calendar, color: C.primary },
  { id: 2, title: 'Ingresos Brutos', value: '$ 48,320', trend: '+21.3%', isPositive: true, icon: TrendingUp, color: C.mint },
  { id: 3, title: 'Comisión Plataforma', value: '$ 7,248', trend: '+15.2%', isPositive: true, icon: Wallet, color: '#8B5CF6' },
  { id: 4, title: 'Cancelaciones', value: '34', trend: '-3.2%', isPositive: false, icon: AlertCircle, color: '#EF4444' },
];

const OP_KPIS = [
  { id: 1, title: 'Retiros Pendientes', value: '12', icon: Clock, color: '#F59E0B' },
  { id: 2, title: 'Prop. en Revisión', value: '8', icon: SearchCheck, color: '#3B82F6' },
  { id: 3, title: 'Nuevos Usuarios', value: '142', icon: Users, color: '#10B981' },
  { id: 4, title: 'Tickets Pendientes', value: '24', icon: Headphones, color: '#EF4444' },
];

const RECENT_ACTIVITY = [
  { id: 1, title: 'Nueva reserva confirmada', subtitle: 'Villa de Cristal • 5 noches', time: 'hace 4 min', icon: CheckCircle2, iconColor: '#10B981' },
  { id: 2, title: 'Solicitud de retiro', subtitle: 'Carlos R. • $ 2,400', time: 'hace 21 min', icon: Wallet, iconColor: '#F59E0B' },
  { id: 3, title: 'Propiedad en revisión', subtitle: 'Casa del Lago • Ana G.', time: 'hace 1h', icon: ShieldCheck, iconColor: '#3B82F6' },
  { id: 4, title: 'Pago completado', subtitle: 'Taller Cacao • Comisión cobrada', time: 'hace 2h', icon: CreditCard, iconColor: '#10B981' },
  { id: 5, title: 'Ticket de soporte nuevo', subtitle: 'Usuario no puede acceder a su cuenta', time: 'hace 3h', icon: Headphones, iconColor: '#EF4444' },
];

export default function DashboardIndex() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header & Acciones Rápidas ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Resumen General</Text>
          <Text style={{ fontSize: 15, color: C.textMuted, marginTop: 4, fontWeight: '500' }}>Monitor en tiempo real de operaciones e ingresos.</Text>
        </View>
        
        {/* Acciones Rápidas */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1 }}>
          <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: '#EFF6FF' }}>
            <Text style={{ color: '#2563EB', fontWeight: '700', fontSize: 13 }}>Aprobar Propiedades</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: '#FFFBEB' }}>
            <Text style={{ color: '#D97706', fontWeight: '700', fontSize: 13 }}>Procesar Retiros</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' }}>
            <Text style={{ color: C.textDark, fontWeight: '700', fontSize: 13 }}>Ver Reservas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
            paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999,
            borderWidth: 1, borderColor: '#E2E8F0'
          }}>
            <Text style={{ color: C.textDark, fontWeight: '700', marginRight: 8, fontSize: 13 }}>Exportar</Text>
            <ArrowRight size={14} color={C.textDark} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Fila 1: KPIs Principales (Dinero y Volumen) ─── */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -10, marginBottom: 20 }}>
        {KPIS.map((kpi, idx) => {
          const Icon = kpi.icon;
          // Reservas activas usa el gradiente espectacular
          if (idx === 0) {
            return (
              <View key={kpi.id} style={{ width: '25%', paddingHorizontal: 10 }}>
                <LinearGradient
                  colors={[C.mint, C.primary]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  style={{
                    padding: 24, borderRadius: 20,
                    shadowColor: C.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
                    height: '100%', justifyContent: 'space-between'
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={20} color="#FFFFFF" strokeWidth={2.5} />
                    </View>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>{kpi.trend}</Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '800', marginBottom: 4, letterSpacing: 0.5 }}>{kpi.title.toUpperCase()}</Text>
                    <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900', letterSpacing: -1 }}>{kpi.value}</Text>
                  </View>
                </LinearGradient>
              </View>
            );
          }

          return (
            <View key={kpi.id} style={{ width: '25%', paddingHorizontal: 10 }}>
              <View style={{
                backgroundColor: C.card, padding: 24, borderRadius: 20,
                shadowColor: '#334155', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 20, elevation: 5,
                borderWidth: 1, borderColor: C.borderLight,
                height: '100%', justifyContent: 'space-between'
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={kpi.color} strokeWidth={2.5} />
                  </View>
                  <View style={{ backgroundColor: kpi.isPositive ? '#ECFDF5' : '#FEF2F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}>
                    <Text style={{ color: kpi.isPositive ? C.primary : '#EF4444', fontSize: 12, fontWeight: '800' }}>{kpi.trend}</Text>
                  </View>
                </View>
                <View style={{ marginTop: 20 }}>
                  <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', marginBottom: 4, letterSpacing: 0.5 }}>{kpi.title.toUpperCase()}</Text>
                  <Text style={{ color: C.textDark, fontSize: 32, fontWeight: '900', letterSpacing: -1 }}>{kpi.value}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Fila 2: Operación Crítica (Más pequeñas y compactas) ─── */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -10, marginBottom: 32 }}>
        {OP_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <View key={kpi.id} style={{ width: '25%', paddingHorizontal: 10 }}>
              <View style={{
                backgroundColor: C.card, padding: 18, borderRadius: 16,
                shadowColor: '#334155', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.03, shadowRadius: 15, elevation: 3,
                borderWidth: 1, borderColor: C.borderLight,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                    <Icon size={18} color={kpi.color} strokeWidth={2} />
                  </View>
                  <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '700' }}>{kpi.title}</Text>
                </View>
                <Text style={{ color: C.textDark, fontSize: 20, fontWeight: '900' }}>{kpi.value}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Bottom Section (Gráficas y Actividad) ─── */}
      <View style={{ flexDirection: 'row', marginHorizontal: -10 }}>
        
        {/* Main Chart + Advanced Metrics */}
        <View style={{ width: '60%', paddingHorizontal: 10 }}>
          <View style={{
            backgroundColor: C.card, borderRadius: 24, padding: 32,
            shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
            borderWidth: 1, borderColor: C.borderLight, flex: 1
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: C.textDark }}>Ingresos por Día</Text>
                <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '500', marginTop: 2 }}>Comisiones cobradas plataforma vs Total</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 4, borderRadius: 8 }}>
                <Text style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#FFFFFF', borderRadius: 6, fontWeight: '700', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2 }}>Semana</Text>
                <Text style={{ paddingHorizontal: 12, paddingVertical: 6, color: C.textMuted, fontWeight: '600' }}>Mes</Text>
              </View>
            </View>
            
            {/* Soft Startup Graph Mock Placeholder */}
            <View style={{ flex: 1, backgroundColor: '#F8FAFC', borderRadius: 16, alignItems: 'center', justifyContent: 'center', minHeight: 250, overflow: 'hidden', position: 'relative', marginBottom: 24 }}>
               <Activity size={48} color={C.borderLight} strokeWidth={2} />
               <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', opacity: 0.2 }}>
                 <LinearGradient colors={[C.mint, 'transparent']} style={{ flex: 1 }} />
               </View>
            </View>

            {/* Advanced Metrics (Small Footer Cards inside Graph Card) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Ticket size={16} color={C.textMuted} strokeWidth={2} />
                </View>
                <View>
                  <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '700' }}>TICKET PROMEDIO</Text>
                  <Text style={{ color: C.textDark, fontSize: 18, fontWeight: '900' }}>$ 380</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Percent size={16} color={C.textMuted} strokeWidth={2} />
                </View>
                <View>
                  <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '700' }}>CONVERSIÓN</Text>
                  <Text style={{ color: C.textDark, fontSize: 18, fontWeight: '900' }}>4.2%</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <PieChart size={16} color={C.textMuted} strokeWidth={2} />
                </View>
                <View>
                  <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '700' }}>OCUPACIÓN</Text>
                  <Text style={{ color: C.textDark, fontSize: 18, fontWeight: '900' }}>78%</Text>
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* Recent Activity Card */}
        <View style={{ width: '40%', paddingHorizontal: 10 }}>
          <View style={{
            backgroundColor: C.card, borderRadius: 24, padding: 32,
            shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
            borderWidth: 1, borderColor: C.borderLight, flex: 1
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: C.textDark }}>Actividad Reciente</Text>
              <TouchableOpacity>
                <Text style={{ color: C.primary, fontWeight: '700', fontSize: 14 }}>Ver registro completo</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              {RECENT_ACTIVITY.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <View key={activity.id} style={{
                    flexDirection: 'row', alignItems: 'center',
                    paddingVertical: 18, // Slightly larger padding to breathe properly
                    borderBottomWidth: index === RECENT_ACTIVITY.length - 1 ? 0 : 1,
                    borderBottomColor: '#F1F5F9'
                  }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                      <Icon size={20} color={activity.iconColor} strokeWidth={2.5} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{activity.title}</Text>
                      <Text style={{ color: C.textMuted, fontSize: 13, marginTop: 2, fontWeight: '500' }}>{activity.subtitle}</Text>
                    </View>
                    <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600' }}>{activity.time}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

      </View>

    </ScrollView>
  );
}
