import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, Search, Eye, ChevronLeft, ChevronRight, 
  CheckCircle2, Clock, ShieldCheck, Ban, 
  Filter, MoreHorizontal, Building2, Wallet, 
  Star, Briefcase
} from 'lucide-react-native';
import { db } from '../../src/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',
};

export default function HostsScreen() {
  const [filter, setFilter] = useState('Todos');
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'owners'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hostsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHosts(hostsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusStyle = (status: string) => {
    const s = status || 'Pendiente';
    switch(s) {
      case 'Verificado': return { text: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 };
      case 'En verificación': 
      case 'En revisión':
      case 'Pendiente': return { text: '#F59E0B', bg: '#FFFBEB', icon: Clock };
      case 'En Trámite': return { text: '#3B82F6', bg: '#EFF6FF', icon: ShieldCheck };
      case 'Rechazado':
      case 'Suspendido': return { text: '#EF4444', bg: '#FEF2F2', icon: Ban };
      default: return { text: '#64748B', bg: '#F8FAFC', icon: Clock };
    }
  };

  const filteredHosts = hosts.filter(host => {
    const matchesSearch = (host.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (host.email || '').toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'Todos') return matchesSearch;
    if (filter === 'Verificados') return matchesSearch && host.verificationStatus === 'Verificado';
    if (filter === 'Pendientes') return matchesSearch && (host.verificationStatus === 'En verificación' || host.verificationStatus === 'En revisión' || !host.verificationStatus);
    if (filter === 'Suspendidos') return matchesSearch && host.verificationStatus === 'Rechazado';
    return matchesSearch;
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
      
      {/* ─── Header ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Anfitriones</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Directorio completo de propietarios y gestores de activos.</Text>
        </View>
        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary,
          paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
          shadowColor: C.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5
        }}>
           <Plus size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 8 }} />
           <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>Añadir Anfitrión</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Table Filter + Search ─── */}
      <View style={{
        backgroundColor: C.card, borderRadius: 24, padding: 32,
        shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
        borderWidth: 1, borderColor: C.borderLight
      }}>
        
        {/* Controles de Tabla */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Todos', 'Verificados', 'Pendientes', 'Suspendidos'].map((label) => {
              const isSel = filter === label;
              return (
                <TouchableOpacity 
                  key={label}
                  onPress={() => setFilter(label)}
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
              <TextInput 
                placeholder="Buscar anfitrión..." 
                value={search}
                onChangeText={setSearch}
                style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} 
              />
          </View>
        </View>

        {/* Cabecera Tabla */}
        <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
          <Text style={{ flex: 2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ANFITRIÓN / EMAIL</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PROPIEDADES</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>RATING</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ESTADO</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, textAlign: 'right' }}>INGRESOS YTD</Text>
          <View style={{ width: 80 }} />
        </View>

        {/* Filas */}
        {loading ? (
          <View style={{ paddingVertical: 40 }}><ActivityIndicator color={C.primary} /></View>
        ) : filteredHosts.map((item, idx) => {
          const vStatus = item.verificationStatus || 'Pendiente';
          const statusStyle = getStatusStyle(vStatus);
          const StatusIcon = statusStyle.icon;

          return (
            <View key={item.id} style={{ 
              flexDirection: 'row', alignItems: 'center', paddingVertical: 18, 
              borderBottomWidth: idx === filteredHosts.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' 
            }}>
              
              {/* Anfitrión */}
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                  <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 14 }}>{(item.name || 'U')[0].toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.name || 'Usuario Trabbitt'}</Text>
                  <Text style={{ color: C.textMuted, fontSize: 12 }}>{item.email}</Text>
                </View>
              </View>

              {/* Propiedades */}
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                 <Building2 size={14} color="#CBD5E1" style={{ marginRight: 8 }} />
                 <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>0</Text>
              </View>

              {/* Rating */}
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                 <Star size={14} color="#F59E0B" fill="#F59E0B" style={{ marginRight: 6 }} />
                 <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>4.8</Text>
              </View>

              {/* Estado */}
              <View style={{ flex: 1 }}>
                <View style={{ 
                  alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, 
                  backgroundColor: statusStyle.bg, flexDirection: 'row', alignItems: 'center' 
                }}>
                  <StatusIcon size={12} color={statusStyle.text} strokeWidth={2.5} />
                  <Text style={{ color: statusStyle.text, fontSize: 11, fontWeight: '800', marginLeft: 6 }}>{vStatus.toUpperCase()}</Text>
                </View>
              </View>

              {/* Ingresos */}
              <Text style={{ flex: 1, color: C.primary, fontSize: 14, fontWeight: '900', textAlign: 'right' }}>Q 0.00</Text>

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
            <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '600' }}>Mostrando <Text style={{ color: C.textDark, fontWeight: '800' }}>1 a {filteredHosts.length}</Text> de {hosts.length} anfitriones</Text>
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
