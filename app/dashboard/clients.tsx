import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { 
  Search, Users, Star, UserPlus, UserMinus, 
  MapPin, Calendar, CreditCard, Eye, 
  ChevronLeft, ChevronRight, MoreHorizontal 
} from 'lucide-react-native';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',
};

const CLIENTS_DATA = [
  { id: 'CLI-001', name: 'Patricia Morales', email: 'patricia@mail.com', city: 'Ciudad GT', bookings: 8, totalSpent: 'Q 22,400', memberSince: 'Ago 2024', avatar: 'P', type: 'VIP' },
  { id: 'CLI-002', name: 'Roberto León', email: 'roberto@mail.com', city: 'Antigua GT', bookings: 3, totalSpent: 'Q 6,800', memberSince: 'Nov 2024', avatar: 'R', type: 'Nuevo' },
  { id: 'CLI-003', name: 'Sandra Pozuelo', email: 'sandra@mail.com', city: 'Xela GT', bookings: 12, totalSpent: 'Q 38,100', memberSince: 'Mar 2024', avatar: 'S', type: 'VIP' },
  { id: 'CLI-004', name: 'David Chávez', email: 'david@mail.com', city: 'Petén GT', bookings: 1, totalSpent: 'Q 2,600', memberSince: 'Ene 2025', avatar: 'D', type: 'Nuevo' },
  { id: 'CLI-005', name: 'Luisa Tambriz', email: 'luisa@mail.com', city: 'Cobán GT', bookings: 5, totalSpent: 'Q 11,200', memberSince: 'Jun 2024', avatar: 'L', type: 'Frecuente' },
];

export default function ClientsScreen() {
  const [filterType, setFilterType] = useState('Todas');
  const [search, setSearch] = useState('');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header Section ─── */}
      <View style={{ marginBottom: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Clientes</Text>
        <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>5 usuarios registrados</Text>
      </View>

      {/* ─── Tabla Bento ─── */}
      <View style={{
        backgroundColor: C.card, borderRadius: 24, padding: 32,
        shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
        borderWidth: 1, borderColor: C.borderLight
      }}>
        
        {/* Filtros + Search (Diseño Compacto) */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            {['Todas', 'VIP', 'Nuevos', 'Inactivos'].map((label) => {
              const isSel = filterType === label;
              return (
                <TouchableOpacity 
                  key={label}
                  onPress={() => setFilterType(label)}
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
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
              borderWidth: 1, borderColor: '#E2E8F0', width: 300
            }}>
              <Search size={14} color={C.textMuted} />
              <TextInput 
                placeholder="Buscar cliente..." 
                value={search}
                onChangeText={setSearch}
                style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} 
              />
          </View>
        </View>

        {/* Cabecera Tabla */}
        <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
          <Text style={{ flex: 2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>CLIENTE</Text>
          <Text style={{ flex: 1.5, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>CIUDAD</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>RESERVAS</Text>
          <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>TOTAL GASTADO</Text>
          <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>MIEMBRO DESDE</Text>
          <Text style={{ width: 80, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, textAlign: 'center' }}>ACCIONES</Text>
        </View>

        {/* Filas */}
        {CLIENTS_DATA.map((item, idx) => (
          <View key={idx} style={{ 
            flexDirection: 'row', alignItems: 'center', paddingVertical: 18, 
            borderBottomWidth: idx === CLIENTS_DATA.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' 
          }}>
            
            {/* Cliente */}
            <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 14 }}>{item.avatar}</Text>
              </View>
              <View>
                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.name}</Text>
                <Text style={{ color: C.textMuted, fontSize: 12 }}>{item.email}</Text>
              </View>
            </View>

            {/* Ciudad */}
            <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
              <MapPin size={14} color="#CBD5E1" style={{ marginRight: 6 }} />
              <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '600' }}>{item.city}</Text>
            </View>

            {/* Reservas */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '900' }}>{item.bookings}</Text>
            </View>

            {/* Total Gastado */}
            <View style={{ flex: 1.2 }}>
              <Text style={{ color: C.primary, fontSize: 14, fontWeight: '900' }}>{item.totalSpent}</Text>
            </View>

            {/* Miembro Desde */}
            <View style={{ flex: 1.2 }}>
              <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '600' }}>{item.memberSince}</Text>
            </View>

            {/* Acciones */}
            <View style={{ width: 80, flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity style={{ padding: 8, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                <Eye size={16} color={C.textMuted} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Paginación */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
            <Text style={{ color: C.textMuted, fontSize: 14, fontWeight: '600' }}>Mostrando <Text style={{ color: C.textDark, fontWeight: '800' }}>1 a 5</Text> de 1.2k clientes</Text>
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
