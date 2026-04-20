import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, Search, Eye, Calendar, Clock, 
  CheckCircle2, Ban, Play, MapPin, 
  User, ChevronLeft, ChevronRight, Filter
} from 'lucide-react-native';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',
};

const BOOKINGS_DATA = [
  { id: 'RES-701', guest: 'Patricia M.', property: 'Villa de Cristal', dates: '10 - 15 Abr', nights: 5, amount: 'Q 4,250', status: 'En Curso', avatar: 'P' },
  { id: 'RES-702', guest: 'Roberto León', property: 'Cabaña Bosque', dates: '18 - 20 Abr', nights: 2, amount: 'Q 840', status: 'Pendiente', avatar: 'R' },
  { id: 'RES-703', guest: 'Sandra P.', property: 'Loft Skyview', dates: '22 - 25 Abr', nights: 3, amount: 'Q 960', status: 'Confirmada', avatar: 'S' },
  { id: 'RES-704', guest: 'David C.', property: 'Garden House', dates: '01 - 05 May', nights: 4, amount: 'Q 2,600', status: 'Cancelada', avatar: 'D' },
  { id: 'RES-705', guest: 'Luisa T.', property: 'Ocean Front', dates: '12 - 14 Abr', nights: 2, amount: 'Q 980', status: 'Confirmada', avatar: 'L' },
];

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('Todas');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Confirmada': return { text: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 };
      case 'Pendiente': return { text: '#F59E0B', bg: '#FFFBEB', icon: Clock };
      case 'En Curso': return { text: '#3B82F6', bg: '#EFF6FF', icon: Play };
      case 'Cancelada': return { text: '#EF4444', bg: '#FEF2F2', icon: Ban };
      default: return { text: '#64748B', bg: '#F8FAFC', icon: Calendar };
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Reservas</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Flujo de huéspedes y control de ocupación en tiempo real.</Text>
        </View>
        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: C.textDark,
          paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
          shadowColor: C.textDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5
        }}>
           <Plus size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 8 }} />
           <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>Nueva Reserva</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Table Filter + Search ─── */}
      <View style={{
        backgroundColor: C.card, borderRadius: 24, padding: 32,
        shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
        borderWidth: 1, borderColor: C.borderLight
      }}>
        
        {/* Controles */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Todas', 'Confirmadas', 'En Curso', 'Pendientes'].map((label) => {
              const isSel = activeTab === label;
              return (
                <TouchableOpacity 
                  key={label}
                  onPress={() => setActiveTab(label)}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999,
                    backgroundColor: isSel ? C.textDark : '#F1F5F9',
                    borderWidth: 1, borderColor: isSel ? C.textDark : '#E2E8F0'
                  }}
                >
                  <Text style={{ color: isSel ? '#FFFFFF' : C.textMuted, fontSize: 12, fontWeight: '800' }}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{
              flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
              paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
              borderWidth: 1, borderColor: '#E2E8F0', width: 280
            }}>
              <Search size={14} color={C.textMuted} />
              <TextInput placeholder="Buscar ID o huésped..." style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} />
          </View>
        </View>

        {/* Cabecera Tabla */}
        <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
          <Text style={{ width: 100, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ID RES</Text>
          <Text style={{ flex: 1.5, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>HUÉSPED</Text>
          <Text style={{ flex: 1.5, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PROPIEDAD</Text>
          <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>FECHAS</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ESTADO</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, textAlign: 'right' }}>MONTO</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Filas */}
        {BOOKINGS_DATA.map((item, idx) => {
          const statusStyle = getStatusStyle(item.status);
          const StatusIcon = statusStyle.icon;

          return (
            <View key={idx} style={{ 
              flexDirection: 'row', alignItems: 'center', paddingVertical: 18, 
              borderBottomWidth: idx === BOOKINGS_DATA.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' 
            }}>
              
              {/* ID */}
              <View style={{ width: 100 }}>
                 <Text style={{ color: C.textMuted, fontSize: 12, fontWeight: '800', fontFamily: 'monospace' }}>{item.id}</Text>
              </View>

              {/* Huésped */}
              <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 14 }}>{item.avatar}</Text>
                </View>
                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.guest}</Text>
              </View>

              {/* Propiedad */}
              <View style={{ flex: 1.5 }}>
                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '700' }}>{item.property}</Text>
              </View>

              {/* Fechas */}
              <View style={{ flex: 1.2, flexDirection: 'row', alignItems: 'center' }}>
                 <Calendar size={14} color={C.textMuted} style={{ marginRight: 8 }} />
                 <Text style={{ color: C.textDark, fontSize: 13, fontWeight: '600' }}>{item.dates}</Text>
              </View>

              {/* Estado */}
              <View style={{ flex: 1 }}>
                <View style={{ 
                  alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, 
                  backgroundColor: statusStyle.bg, flexDirection: 'row', alignItems: 'center' 
                }}>
                  <StatusIcon size={12} color={statusStyle.text} strokeWidth={2.5} />
                  <Text style={{ color: statusStyle.text, fontSize: 11, fontWeight: '800', marginLeft: 6 }}>{item.status.toUpperCase()}</Text>
                </View>
              </View>

              {/* Monto */}
              <Text style={{ flex: 1, color: C.primary, fontSize: 14, fontWeight: '900', textAlign: 'right' }}>{item.amount}</Text>

              {/* Acciones */}
              <View style={{ width: 80, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={{ padding: 8, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                  <Eye size={16} color={C.textMuted} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Paginación */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
            <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '600' }}>Mostrando <Text style={{ color: C.textDark, fontWeight: '800' }}>1 a 5</Text> de 1,240 reservas</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={{ padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
                <ChevronLeft size={18} color={C.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8 }}>
                <ChevronRight size={18} color={C.textDark} />
              </TouchableOpacity>
            </View>
        </View>

      </View>

    </ScrollView>
  );
}
