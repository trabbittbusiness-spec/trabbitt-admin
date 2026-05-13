import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, Calendar, User, MapPin, 
  CheckCircle2, Clock, Ban, Play, 
  DollarSign, CreditCard, MessageCircle, 
  Info, ShieldCheck, History, MoreVertical,
  Building2, Star
} from 'lucide-react-native';
import { db } from '../../../src/lib/firebase';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  primary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  textDark: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
};

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, 'bookings', id as string), async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        let bookingData = { id: snap.id, ...data };

        // If booking has a clientId (DocumentReference), fetch real-time user data
        if (data.clientId) {
          try {
            const userDoc = await getDoc(data.clientId);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              bookingData.guest = {
                ...bookingData.guest,
                name: `${userData.name || ''} ${userData.lastName || ''}`.trim() || bookingData.guest?.name,
                image: userData.photoURL || bookingData.guest?.image
              };
            }
          } catch (e) {
            console.error('Error resolving clientId:', e);
          }
        }
        
        setBooking(bookingData);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    try {
      await updateDoc(doc(db, 'bookings', id as string), { status: newStatus });
      Alert.alert('Éxito', `Reserva marcada como ${newStatus}`);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <Text style={{ fontSize: 18, color: C.textDark, fontWeight: '700' }}>Reserva no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: C.primary, fontWeight: '800' }}>Volver al panel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed': return { label: 'CONFIRMADA', color: C.primary, bg: '#ECFDF5', icon: CheckCircle2 };
      case 'active': return { label: 'EN CURSO', color: C.info, bg: '#EFF6FF', icon: Play };
      case 'completed': return { label: 'COMPLETADA', color: C.primary, bg: '#ECFDF5', icon: CheckCircle2 };
      case 'cancelled': return { label: 'CANCELADA', color: C.danger, bg: '#FEF2F2', icon: Ban };
      default: return { label: 'PENDIENTE', color: C.warning, bg: '#FFFBEB', icon: Clock };
    }
  };

  const s = getStatusConfig(booking.status);
  const StatusIcon = s.icon;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* ─── Top Bar ─── */}
      <View style={{ 
        flexDirection: 'row', alignItems: 'center', padding: 24, 
        backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: C.border,
        zIndex: 10
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{
          width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9',
          alignItems: 'center', justifyContent: 'center', marginRight: 16
        }}>
          <ArrowLeft size={20} color={C.textDark} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 }}>Detalle de Reserva</Text>
          <Text style={{ fontSize: 22, fontWeight: '900', color: C.textDark }}>ID: {booking.id.toUpperCase()}</Text>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={{
            paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#F1F5F9',
            flexDirection: 'row', alignItems: 'center', gap: 8
          }}>
            <MessageCircle size={18} color={C.textDark} />
            <Text style={{ fontWeight: '700', color: C.textDark }}>Mensaje</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: C.textDark,
            flexDirection: 'row', alignItems: 'center', gap: 8
          }}>
            <MoreVertical size={18} color="#FFFFFF" />
            <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>Acciones</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 40, gap: 32 }}>
        
        {/* ─── Main Content Grid ─── */}
        <View style={{ flexDirection: 'row', gap: 32 }}>
          
          {/* Left Column (Details) */}
          <View style={{ flex: 2, gap: 32 }}>
            
            {/* Status Summary Card */}
            <View style={{ 
              backgroundColor: s.bg, borderRadius: 24, padding: 32, 
              borderWidth: 1, borderColor: s.color + '20',
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: s.color, shadowOpacity: 0.1, shadowRadius: 10 }}>
                  <StatusIcon size={32} color={s.color} strokeWidth={2.5} />
                </View>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: s.color, letterSpacing: 1, marginBottom: 4 }}>ESTADO ACTUAL</Text>
                  <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark }}>{s.label}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                 <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '600', marginBottom: 4 }}>Fecha de Creación</Text>
                 <Text style={{ fontSize: 15, fontWeight: '800', color: C.textDark }}>
                   {booking.createdAt?.toDate ? booking.createdAt.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Hoy'}
                 </Text>
              </View>
            </View>

            {/* Guest & Property Sections */}
            <View style={{ flexDirection: 'row', gap: 32 }}>
              
              {/* Guest Card */}
              <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: C.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <User size={20} color={C.primary} />
                  <Text style={{ fontSize: 16, fontWeight: '900', color: C.textDark }}>Huésped</Text>
                </View>
                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                  <Image source={{ uri: booking.guest?.image || 'https://i.pravatar.cc/150' }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 16 }} />
                  <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>{booking.guest?.name || 'Huésped'}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Star size={14} color={C.warning} fill={C.warning} />
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.textMuted }}>{booking.guest?.rating || '4.8'} • Verificado</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ width: '100%', paddingVertical: 12, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: C.textDark }}>Ver Perfil Completo</Text>
                </TouchableOpacity>
              </View>

              {/* Property Card */}
              <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: C.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <Building2 size={20} color={C.info} />
                  <Text style={{ fontSize: 16, fontWeight: '900', color: C.textDark }}>Propiedad</Text>
                </View>
                <View style={{ gap: 16 }}>
                  <View>
                    <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 }}>TÍTULO</Text>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: C.textDark }} numberOfLines={2}>{booking.propertyTitle}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 }}>UBICACIÓN</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <MapPin size={14} color={C.textMuted} style={{ marginTop: 2 }} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: C.textDark, flex: 1 }}>{booking.propertyAddress}</Text>
                    </View>
                  </View>
                  <View style={{ padding: 12, backgroundColor: '#F0FDF4', borderRadius: 12, alignSelf: 'flex-start' }}>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: C.primary }}>{booking.propertyType?.toUpperCase() || 'PROPIEDAD'}</Text>
                  </View>
                </View>
              </View>

            </View>

            {/* Stay Details */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: C.border }}>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                  <Calendar size={20} color={C.textDark} />
                  <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark }}>Detalles de la Estadía</Text>
               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                 <View style={{ flex: 1, gap: 8 }}>
                   <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '800' }}>CHECK-IN</Text>
                   <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>{booking.checkIn ? new Date(booking.checkIn).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'TBD'}</Text>
                   <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMuted }}>15:00 PM</Text>
                 </View>
                 <View style={{ width: 1, height: '100%', backgroundColor: C.border }} />
                 <View style={{ flex: 1, paddingLeft: 32, gap: 8 }}>
                   <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '800' }}>CHECK-OUT</Text>
                   <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>{booking.checkOut ? new Date(booking.checkOut).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'TBD'}</Text>
                   <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMuted }}>11:00 AM</Text>
                 </View>
                 <View style={{ width: 1, height: '100%', backgroundColor: C.border }} />
                 <View style={{ flex: 1, paddingLeft: 32, gap: 8 }}>
                   <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '800' }}>DURACIÓN</Text>
                   <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>{booking.nights || 1} Noches</Text>
                   <Text style={{ fontSize: 14, fontWeight: '600', color: C.textMuted }}>{booking.participants || 2} Personas</Text>
                 </View>
               </View>
            </View>

          </View>

          {/* Right Column (Financials & Actions) */}
          <View style={{ flex: 1, gap: 32 }}>
            
            {/* Financial Summary */}
            <View style={{ backgroundColor: '#0F172A', borderRadius: 32, padding: 32, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20 }}>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                  <DollarSign size={20} color={C.primary} />
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFFFFF' }}>Desglose de Pago</Text>
               </View>
               
               <View style={{ gap: 20, marginBottom: 32 }}>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                   <Text style={{ color: '#94A3B8', fontSize: 15, fontWeight: '600' }}>Precio base</Text>
                   <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>Q {booking.accommodation || 0}</Text>
                 </View>
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                   <Text style={{ color: '#94A3B8', fontSize: 15, fontWeight: '600' }}>Comisión Trabbitt</Text>
                   <Text style={{ color: C.primary, fontSize: 15, fontWeight: '800' }}>+ Q {booking.trabbittFee || 0}</Text>
                 </View>
                 <View style={{ height: 1, backgroundColor: '#334155' }} />
                 <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>Total</Text>
                   <Text style={{ color: C.primary, fontSize: 24, fontWeight: '900' }}>Q {booking.total || 0}</Text>
                 </View>
               </View>

               <View style={{ backgroundColor: '#1E293B', borderRadius: 16, padding: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <CreditCard size={16} color="#94A3B8" />
                    <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700' }}>Método de Pago</Text>
                  </View>
                  <Text style={{ color: '#94A3B8', fontSize: 14, fontWeight: '500' }}>{booking.paymentMethod || 'Mastercard •••• 7805'}</Text>
               </View>
            </View>

            {/* Platform Profit Highlight */}
            <View style={{ backgroundColor: '#ECFDF5', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#D1FAE5' }}>
               <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                 <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
                   <ShieldCheck size={20} color="#FFFFFF" />
                 </View>
                 <View>
                   <Text style={{ fontSize: 12, fontWeight: '800', color: C.primary, textTransform: 'uppercase' }}>Ganancia Plataforma</Text>
                   <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>Q {booking.trabbittFee || 0}</Text>
                 </View>
               </View>
            </View>

            {/* Admin Actions */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: C.border }}>
               <Text style={{ fontSize: 14, fontWeight: '800', color: C.textMuted, textTransform: 'uppercase', marginBottom: 24 }}>Acciones Administrativas</Text>
               <View style={{ gap: 12 }}>
                 <TouchableOpacity 
                   onPress={() => handleUpdateStatus('confirmed')}
                   disabled={booking.status === 'confirmed'}
                   style={{ width: '100%', paddingVertical: 14, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.border, alignItems: 'center', opacity: booking.status === 'confirmed' ? 0.5 : 1 }}
                 >
                   <Text style={{ fontSize: 15, fontWeight: '800', color: C.textDark }}>Marcar como Confirmada</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   onPress={() => handleUpdateStatus('cancelled')}
                   disabled={booking.status === 'cancelled'}
                   style={{ width: '100%', paddingVertical: 14, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.danger, alignItems: 'center', opacity: booking.status === 'cancelled' ? 0.5 : 1 }}
                 >
                   <Text style={{ fontSize: 15, fontWeight: '800', color: C.danger }}>Cancelar Reserva</Text>
                 </TouchableOpacity>
               </View>
            </View>

            {/* Timeline Placeholder */}
            <View style={{ gap: 16 }}>
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <History size={18} color={C.textMuted} />
                  <Text style={{ fontSize: 15, fontWeight: '800', color: C.textDark }}>Historial de Eventos</Text>
               </View>
               <View style={{ gap: 12 }}>
                 {[
                   { label: 'Reserva creada', time: 'Hoy, 6:03 PM', active: true },
                   { label: 'Pago procesado', time: 'Hoy, 6:04 PM', active: true },
                   { label: 'Confirmada por anfitrión', time: 'Pendiente', active: false },
                 ].map((evt, idx) => (
                   <View key={idx} style={{ flexDirection: 'row', gap: 12 }}>
                     <View style={{ alignItems: 'center' }}>
                       <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: evt.active ? C.primary : '#E2E8F0', marginTop: 4 }} />
                       {idx < 2 && <View style={{ width: 2, flex: 1, backgroundColor: '#E2E8F0', marginVertical: 4 }} />}
                     </View>
                     <View>
                       <Text style={{ fontSize: 14, fontWeight: '700', color: evt.active ? C.textDark : C.textMuted }}>{evt.label}</Text>
                       <Text style={{ fontSize: 12, color: C.textMuted }}>{evt.time}</Text>
                     </View>
                   </View>
                 ))}
               </View>
            </View>

          </View>
        </View>

      </ScrollView>
    </View>
  );
}
