import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Briefcase, Camera, Video, Globe, 
  Search, Eye, ChevronLeft, ChevronRight,
  Clock, CheckCircle2, AlertCircle, Calendar
} from 'lucide-react-native';
import { db } from '../../src/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',
};

const SERVICES_KPIS = [
  { id: 1, label: 'Servicios Activos', value: '42', icon: Briefcase, color: '#3B82F6' },
  { id: 2, label: 'Pendientes Hoy', value: '8', icon: Clock, color: '#F59E0B' },
  { id: 3, label: 'Facturado Mes', value: 'Q 12,450', icon: CheckCircle2, color: C.primary },
];

export default function ServicesScreen() {
  const router = useRouter();
  const [filterType, setFilterType] = useState('Todos');
  const [search, setSearch] = useState('');
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'scheduled_services'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSolicitudes(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Completado': return { text: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 };
      case 'Planificado': return { text: '#3B82F6', bg: '#EFF6FF', icon: Calendar };
      case 'Pendiente': return { text: '#F59E0B', bg: '#FFFBEB', icon: Clock };
      default: return { text: '#64748B', bg: '#F8FAFC', icon: AlertCircle };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header ─── */}
      <View style={{ marginBottom: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Servicios Pro</Text>
        <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Gestión de fotografía, video y marketing para anfitriones.</Text>
      </View>

      {/* ─── Bento Table ─── */}
      <View style={{
        backgroundColor: C.card, borderRadius: 24, padding: 32,
        shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
        borderWidth: 1, borderColor: C.borderLight
      }}>
        
        {/* Filtros + Búsqueda */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            {['Todos', 'Pendientes', 'Planificados', 'Completados'].map((label) => {
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
                placeholder="Buscar solicitud o host..." 
                value={search}
                onChangeText={setSearch}
                style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} 
              />
          </View>
        </View>

        {/* Cabecera Tabla */}
        <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
          <Text style={{ flex: 1.8, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ANFITRIÓN / PROPIEDAD</Text>
          <Text style={{ flex: 1.5, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>SERVICIO</Text>
          <Text style={{ flex: 1.5, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>FECHA Y HORA</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>TARIFA</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ESTADO</Text>
          <Text style={{ width: 80, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, textAlign: 'center' }}>ACCIONES</Text>
        </View>

        {/* Filas de la Tabla */}
        {loading ? (
          <ActivityIndicator style={{ marginVertical: 40 }} size="large" color={C.primary} />
        ) : (
          solicitudes.length === 0 ? (
            <Text style={{ textAlign: 'center', marginVertical: 40, color: C.textMuted }}>No hay servicios agendados</Text>
          ) : (
            solicitudes.map((item, idx) => {
              const statusStyle = getStatusStyle(item.status || 'Pendiente');
              const StatusIcon = statusStyle.icon;
              
              const pkgName = item.packageName || 'Servicio';
              const price = item.price || 'Q 0';
              const dateObj = item.createdAt?.toDate ? item.createdAt.toDate() : new Date();
              const dateStr = dateObj.toLocaleDateString() + ', ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
              // Usamos el ID del propietario ya que por ahora es el dato más seguro que tenemos de la app Owner
              const hostName = `Propietario (${item.ownerId?.substring(0,4) || 'Unk'})`;
              const initial = 'P';
              
              // Mostramos un extracto de las coordenadas como "Propiedad"
              const propertyLocation = item.location ? `${item.location.lat?.toFixed(4)}, ${item.location.lng?.toFixed(4)}` : `ID: ${item.id.substring(0,6)}`;

              return (
                <View key={item.id || idx} style={{ 
                  flexDirection: 'row', alignItems: 'center', paddingVertical: 18, 
                  borderBottomWidth: idx === solicitudes.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' 
                }}>
                  
                  {/* Host & Propiedad */}
                  <View style={{ flex: 1.8, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 14 }}>{initial}</Text>
                    </View>
                    <View>
                      <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{hostName}</Text>
                      <Text style={{ color: C.textMuted, fontSize: 12 }}>Coord: {propertyLocation}</Text>
                    </View>
                  </View>

                  {/* Servicio */}
                  <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                    <Briefcase size={14} color="#CBD5E1" style={{ marginRight: 8 }} />
                    <Text style={{ color: C.textDark, fontSize: 13, fontWeight: '600' }}>{pkgName}</Text>
                  </View>

                  {/* Fecha */}
                  <View style={{ flex: 1.5 }}>
                    <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '600' }}>{dateStr}</Text>
                  </View>

                  {/* Tarifa */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{price}</Text>
                  </View>

                  {/* Estado */}
                  <View style={{ flex: 1 }}>
                    <View style={{ 
                      alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, 
                      backgroundColor: statusStyle.bg, flexDirection: 'row', alignItems: 'center' 
                    }}>
                      <StatusIcon size={12} color={statusStyle.text} strokeWidth={2.5} />
                      <Text style={{ color: statusStyle.text, fontSize: 11, fontWeight: '800', marginLeft: 6 }}>{(item.status || 'Pendiente').toUpperCase()}</Text>
                    </View>
                  </View>

                  {/* Acciones */}
                  <View style={{ width: 80, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity 
                      onPress={() => router.push(`/dashboard/services/${item.id}`)}
                      style={{ padding: 8, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' }}
                    >
                      <Eye size={16} color={C.textMuted} strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )
        )}

        {/* Paginación */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
            <Text style={{ color: C.textMuted, fontSize: 14, fontWeight: '600' }}>Mostrando <Text style={{ color: C.textDark, fontWeight: '800' }}>{solicitudes.length > 0 ? 1 : 0} a {solicitudes.length}</Text> de {solicitudes.length} solicitudes</Text>
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
    </View>
  );
}
