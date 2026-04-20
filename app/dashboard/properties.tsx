import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, Search, Eye, MapPin, Star, Building2, 
  CalendarCheck, DollarSign, Clock, CheckCircle2, 
  Ban, Filter, ChevronLeft, ChevronRight, Edit3
} from 'lucide-react-native';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',
};

const PROPERTIES_DATA = [
  { id: 'P-101', title: 'Villa de Cristal', location: 'Guanacaste, CR', host: 'Carlos Ruiz', price: 'Q 1,200', rating: 4.9, bookings: 14, status: 'Activa', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80' },
  { id: 'P-102', title: 'Loft Skyview', location: 'Antigua, GT', host: 'Ana García', price: 'Q 850', rating: 4.7, bookings: 8, status: 'Pendiente', image: 'https://images.unsplash.com/photo-1502672260266-1c1e52d3bfde?w=800&q=80' },
  { id: 'P-103', title: 'Cabaña del Bosque', location: 'Monteverde, CR', host: 'Luis Torres', price: 'Q 1,500', rating: 4.8, bookings: 22, status: 'Activa', image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80' },
  { id: 'P-104', title: 'Garden House', location: 'Xela, GT', host: 'Marta Rivas', price: 'Q 2,200', rating: 4.5, bookings: 12, status: 'Activa', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80' },
  { id: 'P-105', title: 'Ocean Front', location: 'Monterrico, GT', host: 'Roberto L.', price: 'Q 3,100', rating: 4.2, bookings: 5, status: 'Suspendida', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80' },
];

export default function PropertiesScreen() {
  const [activeTab, setActiveTab] = useState('Todas');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Activa': return { text: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 };
      case 'Pendiente': return { text: '#F59E0B', bg: '#FFFBEB', icon: Clock };
      case 'Suspendida': return { text: '#EF4444', bg: '#FEF2F2', icon: Ban };
      default: return { text: '#64748B', bg: '#F8FAFC', icon: Clock };
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Anuncios</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Control integral del catálogo de propiedades y experiencias.</Text>
        </View>
        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary,
          paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
          shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5
        }}>
           <Plus size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 8 }} />
           <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>Nuevo Anuncio</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Bento View (List Mode - Premium) ─── */}
      <View style={{
        backgroundColor: C.card, borderRadius: 24, padding: 32,
        shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
        borderWidth: 1, borderColor: C.borderLight
      }}>
        
        {/* Controles */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Todas', 'Activas', 'Pendientes', 'Suspendidas'].map((label) => {
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
              <TextInput placeholder="Buscar anuncio o propiedad..." style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} />
          </View>
        </View>

        {/* Cabecera Tabla */}
        <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
          <Text style={{ flex: 2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PROPIEDAD / UBICACIÓN</Text>
          <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ANFITRIÓN</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PRECIO NP</Text>
          <Text style={{ flex: 0.8, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>RESERVAS</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ESTADO</Text>
          <View style={{ width: 100 }} />
        </View>

        {/* Filas */}
        {PROPERTIES_DATA.map((item, idx) => {
          const statusStyle = getStatusStyle(item.status);
          const StatusIcon = statusStyle.icon;

          return (
            <View key={idx} style={{ 
              flexDirection: 'row', alignItems: 'center', paddingVertical: 18, 
              borderBottomWidth: idx === PROPERTIES_DATA.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' 
            }}>
              
              {/* Propiedad with Thumbnail */}
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', marginRight: 14 }}>
                   <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
                </View>
                <View>
                  <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <MapPin size={10} color={C.textMuted} style={{ marginRight: 4 }} />
                     <Text style={{ color: C.textMuted, fontSize: 12 }}>{item.location}</Text>
                  </View>
                </View>
              </View>

              {/* Anfitrión */}
              <View style={{ flex: 1.2 }}>
                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' }}>{item.host}</Text>
              </View>

              {/* Precio */}
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.price}</Text>
              </View>

              {/* Reservas */}
              <View style={{ flex: 0.8, flexDirection: 'row', alignItems: 'center' }}>
                 <CalendarCheck size={14} color={C.primary} style={{ marginRight: 6 }} />
                 <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.bookings}</Text>
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

              {/* Acciones */}
              <View style={{ width: 100, flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                <TouchableOpacity style={{ padding: 8, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                  <Eye size={16} color={C.textMuted} strokeWidth={2.5} />
                </TouchableOpacity>
                <TouchableOpacity style={{ padding: 8, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
                  <Edit3 size={16} color={C.textMuted} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Paginación */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
            <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '600' }}>Mostrando <Text style={{ color: C.textDark, fontWeight: '800' }}>1 a 5</Text> de 342 anuncios</Text>
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
