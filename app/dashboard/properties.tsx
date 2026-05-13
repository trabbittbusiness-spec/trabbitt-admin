import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Plus, Search, Eye, MapPin, Star, Building2, 
  CalendarCheck, DollarSign, Clock, CheckCircle2, 
  Ban, Filter, ChevronLeft, ChevronRight, Edit3, X
} from 'lucide-react-native';
import { db } from '../../src/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',
};

export default function PropertiesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Todas');
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'advertisements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const adsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAds(adsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ─── Acciones Rápidas ───
  const handleQuickApprove = async (id: string) => {
    try {
      const adToApprove = ads.find(a => a.id === id);
      await updateDoc(doc(db, 'advertisements', id), { verificationStatus: 'Verificado' });
      
      // Log the action
      await addDoc(collection(db, 'system_logs'), {
        action: 'ANUNCIO APROBADO',
        category: 'USER_ACTION',
        details: `El anuncio "${adToApprove?.title || id}" ha sido aprobado y ya es visible.`,
        severity: 'INFO',
        timestamp: serverTimestamp(),
        userName: 'Admin Pro'
      });
    } catch (e) { console.error('Error approving', e); }
  };

  const handleQuickSuspend = async (id: string) => {
    try {
      const adToSuspend = ads.find(a => a.id === id);
      await updateDoc(doc(db, 'advertisements', id), { verificationStatus: 'Rechazado' });

      // Log the action
      await addDoc(collection(db, 'system_logs'), {
        action: 'ANUNCIO SUSPENDIDO',
        category: 'SECURITY',
        details: `El anuncio "${adToSuspend?.title || id}" ha sido suspendido/rechazado.`,
        severity: 'WARNING',
        timestamp: serverTimestamp(),
        userName: 'Admin Pro'
      });
    } catch (e) { console.error('Error suspending', e); }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      const adToFeature = ads.find(a => a.id === id);
      await updateDoc(doc(db, 'advertisements', id), { isFeatured: !current });

      // Log the action
      await addDoc(collection(db, 'system_logs'), {
        action: !current ? 'ANUNCIO DESTACADO' : 'ANUNCIO NO DESTACADO',
        category: 'USER_ACTION',
        details: `El anuncio "${adToFeature?.title || id}" ha sido ${!current ? 'destacado en portada' : 'quitado de destacados'}.`,
        severity: 'INFO',
        timestamp: serverTimestamp(),
        userName: 'Admin Pro'
      });
    } catch (e) { console.error('Error toggling featured', e); }
  };

  const getStatusStyle = (status: string) => {
    const s = status || 'En verificación';
    switch(s) {
      case 'Verificado': 
      case 'Activa': return { text: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 };
      case 'En verificación':
      case 'En revisión':
      case 'Pendiente': return { text: '#F59E0B', bg: '#FFFBEB', icon: Clock };
      case 'Rechazado':
      case 'Suspendida': return { text: '#EF4444', bg: '#FEF2F2', icon: Ban };
      default: return { text: '#64748B', bg: '#F8FAFC', icon: Clock };
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = (ad.title || '').toLowerCase().includes(search.toLowerCase()) || 
                          (ad.location || '').toLowerCase().includes(search.toLowerCase()) ||
                          (ad.ownerName || '').toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === 'Todas') return matchesSearch;
    if (activeTab === 'Activas') return matchesSearch && ad.verificationStatus === 'Verificado';
    if (activeTab === 'Pendientes') return matchesSearch && (ad.verificationStatus === 'En verificación' || ad.verificationStatus === 'En revisión' || !ad.verificationStatus);
    if (activeTab === 'Suspendidas') return matchesSearch && ad.verificationStatus === 'Rechazado';
    return matchesSearch;
  });

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
              <TextInput 
                placeholder="Buscar anuncio o propiedad..." 
                value={search}
                onChangeText={setSearch}
                style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} 
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} style={{ padding: 4, marginLeft: 4 }}>
                  <X size={14} color={C.textMuted} />
                </TouchableOpacity>
              )}
          </View>
        </View>

        {/* Cabecera Tabla */}
        <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
          <Text style={{ flex: 2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PROPIEDAD / UBICACIÓN</Text>
          <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ANFITRIÓN</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>PRECIO NP</Text>
          <Text style={{ flex: 0.8, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>RESERVAS</Text>
          <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ESTADO</Text>
          <View style={{ width: 140 }} />
        </View>

        {/* Filas */}
        {loading ? (
          <View style={{ paddingVertical: 40 }}><ActivityIndicator color={C.primary} /></View>
        ) : filteredAds.map((item, idx) => {
          const vStatus = item.verificationStatus || 'En verificación';
          const statusStyle = getStatusStyle(vStatus);
          const StatusIcon = statusStyle.icon;
          const mainPhoto = item.photos && item.photos.length > 0 ? item.photos[0] : 'https://via.placeholder.com/150';

          return (
            <View key={item.id} style={{ 
              flexDirection: 'row', alignItems: 'center', paddingVertical: 18, 
              borderBottomWidth: idx === filteredAds.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' 
            }}>
              
              {/* Propiedad with Thumbnail */}
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', marginRight: 14 }}>
                   <Image source={{ uri: mainPhoto }} style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Text style={{ color: C.textDark, fontSize: 16, fontWeight: '900' }} numberOfLines={1}>{item.title}</Text>
                    <View style={{ 
                      backgroundColor: item.type === 'experience' ? '#EEF2FF' : '#F0FDF4', 
                      paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
                      borderWidth: 1, borderColor: item.type === 'experience' ? '#C7D2FE' : '#BBF7D0'
                    }}>
                      <Text style={{ 
                        fontSize: 9, fontWeight: '900', 
                        color: item.type === 'experience' ? '#4F46E5' : '#16A34A', 
                        textTransform: 'uppercase', letterSpacing: 0.5 
                      }}>
                        {item.type === 'experience' ? 'EXPERIENCIA' : 'PROPIEDAD'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                     <MapPin size={14} color="#475569" style={{ marginRight: 6 }} />
                     <Text style={{ color: '#475569', fontSize: 14, fontWeight: '600' }} numberOfLines={1}>
                       {item.location ? item.location.split(',').slice(0, 2).join(', ') : 'Ubicación no disponible'}
                     </Text>
                  </View>
                </View>
              </View>

              {/* Anfitrión */}
              <View style={{ flex: 1.2 }}>
                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' }}>{item.ownerName || 'Propietario'}</Text>
              </View>

              {/* Precio */}
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>Q {item.price || 0}</Text>
              </View>

              {/* Reservas */}
              <View style={{ flex: 0.8, flexDirection: 'row', alignItems: 'center' }}>
                 <CalendarCheck size={14} color={C.primary} style={{ marginRight: 6 }} />
                 <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>0</Text>
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

              {/* Acciones */}
              <View style={{ width: 140, flexDirection: 'row', justifyContent: 'flex-end', gap: 6 }}>
                
                {/* Aprobar / Suspender Rápido */}
                {vStatus !== 'Verificado' ? (
                  <TouchableOpacity 
                    onPress={() => handleQuickApprove(item.id)}
                    style={{ padding: 8, backgroundColor: '#ECFDF5', borderRadius: 10, borderWidth: 1, borderColor: '#A7F3D0' }}
                  >
                    <CheckCircle2 size={16} color="#10B981" strokeWidth={2.5} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    onPress={() => handleQuickSuspend(item.id)}
                    style={{ padding: 8, backgroundColor: '#FEF2F2', borderRadius: 10, borderWidth: 1, borderColor: '#FECACA' }}
                  >
                    <Ban size={16} color="#EF4444" strokeWidth={2.5} />
                  </TouchableOpacity>
                )}

                {/* Destacar Rápido */}
                <TouchableOpacity 
                  onPress={() => handleToggleFeatured(item.id, item.isFeatured)}
                  style={{ 
                    padding: 8, 
                    backgroundColor: item.isFeatured ? '#FEF08A' : '#F8FAFC', 
                    borderRadius: 10, 
                    borderWidth: 1, 
                    borderColor: item.isFeatured ? '#FDE047' : '#E2E8F0' 
                  }}
                >
                  <Star size={16} color={item.isFeatured ? "#CA8A04" : C.textMuted} strokeWidth={2.5} />
                </TouchableOpacity>

                {/* Ver Detalles */}
                <TouchableOpacity 
                  onPress={() => router.push(`/dashboard/properties/${item.id}`)}
                  style={{ padding: 8, backgroundColor: '#F8FAFC', borderRadius: 10, borderWidth: 1, borderColor: '#CBD5E1' }}
                >
                  <Eye size={16} color={C.textDark} strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Paginación */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
            <Text style={{ color: C.textMuted, fontSize: 13, fontWeight: '600' }}>Mostrando <Text style={{ color: C.textDark, fontWeight: '800' }}>1 a {filteredAds.length}</Text> de {ads.length} anuncios</Text>
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
