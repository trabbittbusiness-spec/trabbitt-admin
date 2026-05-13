import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, Briefcase, Calendar, MapPin, 
  User, Mail, Phone, CheckCircle2, Clock, CalendarCheck,
  Camera, Video, Plane, Share, FileText, Navigation, CheckCircle, Circle,
  MessageCircle, Receipt, ArrowRight, ExternalLink, X
} from 'lucide-react-native';
import { db } from '../../../src/lib/firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  primary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  textDark: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
};

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [service, setService] = useState<any>(null);
  const [ownerData, setOwnerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Notas internas
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    // Escuchar cambios en vivo del servicio
    const docRef = doc(db, 'scheduled_services', id as string);
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setService({ id: docSnap.id, ...data });
        
        // Fetch owner details
        if (data.ownerId) {
          try {
            const ownerSnap = await getDoc(doc(db, 'owners', data.ownerId));
            if (ownerSnap.exists()) {
              setOwnerData(ownerSnap.data());
            } else {
              setOwnerData({ displayName: 'Usuario Desconocido' });
            }
          } catch (e) {
            setOwnerData({ displayName: 'Error cargando datos' });
          }
        }
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    setIsUpdating(true);
    try {
      const updateData: any = { status: newStatus };
      
      // Si estamos planificando, guardamos también la fecha y hora asignadas
      if (newStatus === 'Planificado') {
        updateData.scheduledDate = scheduledDate;
        updateData.scheduledTime = scheduledTime;
        setShowScheduleForm(false);
      }

      await updateDoc(doc(db, 'scheduled_services', id as string), updateData);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("No se pudo actualizar el estado");
    } finally {
      setIsUpdating(false);
    }
  };

  // Sincronizar texto de la nota cuando cargan los datos
  useEffect(() => {
    if (service?.internalNote) {
      setNoteText(service.internalNote);
    }
  }, [service?.internalNote]);

  const handleSaveNote = async () => {
    if (!id) return;
    setIsSavingNote(true);
    try {
      await updateDoc(doc(db, 'scheduled_services', id as string), {
        internalNote: noteText
      });
      setShowNoteModal(false);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error al guardar la nota.");
    } finally {
      setIsSavingNote(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  if (!service) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.bg }}>
        <Text style={{ color: C.textDark, fontSize: 18, fontWeight: '700' }}>Servicio no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: C.primary, fontWeight: '800' }}>Volver al panel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sStatus = service.status || 'Pendiente';
  const isCompleted = sStatus === 'Completado';
  const isScheduled = sStatus === 'Planificado';
  const isPending = sStatus === 'Pendiente';

  const badgeColor = isCompleted ? C.primary : isScheduled ? '#3B82F6' : C.warning;
  const badgeBg = isCompleted ? '#ECFDF5' : isScheduled ? '#EFF6FF' : '#FFFBEB';
  const badgeBorder = isCompleted ? '#D1FAE5' : isScheduled ? '#DBEAFE' : '#FEF3C7';

  // State calculations for Timeline
  const step1 = true; // Pendiente (always true if created)
  const step2 = isScheduled || isCompleted;
  const step3 = isCompleted;

  // Mock Deliverables based on package
  const pkgName = (service.packageName || '').toLowerCase();
  const deliverables = [
    { label: 'Fotografía HDR Profesional (20-30 fotos)', icon: Camera, active: true },
    { label: 'Video Recorrido Estabilizado 4K', icon: Video, active: pkgName.includes('pro') || pkgName.includes('ultimate') },
    { label: 'Tomas Aéreas con Drone (Sujeto a zona)', icon: Plane, active: pkgName.includes('ultimate') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* ─── Top Bar Premium ─── */}
      <View style={{ 
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 20, 
        backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: C.border,
        zIndex: 10
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{
          width: 44, height: 44, borderRadius: 12, backgroundColor: '#F1F5F9',
          alignItems: 'center', justifyContent: 'center', marginRight: 20
        }}>
          <ArrowLeft size={20} color={C.textDark} />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, color: C.textMuted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>ID: {service.id}</Text>
          <Text style={{ fontSize: 24, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Solicitud: {service.packageName || 'Servicio'}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          {/* Status Badge */}
          <View style={{ 
            paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
            backgroundColor: badgeBg,
            flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1,
            borderColor: badgeBorder, marginRight: 12
          }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: badgeColor }} />
            <Text style={{ color: badgeColor, fontWeight: '800', fontSize: 13, textTransform: 'uppercase' }}>
              {sStatus}
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => setShowNoteModal(true)} 
            style={{ 
              paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, 
              backgroundColor: service?.internalNote ? '#FEF3C7' : '#F1F5F9', 
              flexDirection: 'row', alignItems: 'center', gap: 8, 
              borderWidth: 1, borderColor: service?.internalNote ? '#FDE68A' : 'transparent' 
            }}
          >
            <FileText size={16} color={service?.internalNote ? '#D97706' : C.textDark} />
            <Text style={{ fontWeight: '700', color: service?.internalNote ? '#D97706' : C.textDark, fontSize: 13 }}>
              {service?.internalNote ? 'Ver Nota Interna' : 'Agregar Nota'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
        
        <View style={{ flexDirection: 'row', gap: 32 }}>
          
          {/* ─── LEFT COLUMN (Workflow & Scope) ─── */}
          <View style={{ flex: 2, gap: 32 }}>
            
            {/* Timeline Workflow */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.02, shadowRadius: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark, marginBottom: 32 }}>Estado Operativo</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                {/* Step 1 */}
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: step1 ? '#ECFDF5' : '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: step1 ? C.primary : '#E2E8F0', zIndex: 2 }}>
                    <Clock size={20} color={step1 ? C.primary : '#94A3B8'} />
                  </View>
                  <Text style={{ fontWeight: '800', color: step1 ? C.textDark : C.textMuted, fontSize: 15 }}>Pago Confirmado</Text>
                  <Text style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>{service.createdAt?.toDate ? service.createdAt.toDate().toLocaleDateString() : 'Pendiente'}</Text>
                </View>

                <View style={{ height: 2, backgroundColor: step2 ? C.primary : '#E2E8F0', flex: 1, marginTop: 24, marginHorizontal: -40, zIndex: 1 }} />

                {/* Step 2 */}
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: step2 ? '#EFF6FF' : '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: step2 ? '#3B82F6' : '#E2E8F0', zIndex: 2 }}>
                    <CalendarCheck size={20} color={step2 ? '#3B82F6' : '#94A3B8'} />
                  </View>
                  <Text style={{ fontWeight: '800', color: step2 ? C.textDark : C.textMuted, fontSize: 15 }}>Equipo Asignado</Text>
                  <Text style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>
                    {step2 ? (service.scheduledDate ? `${service.scheduledDate} ${service.scheduledTime}` : 'Planificado') : 'Por agendar'}
                  </Text>
                </View>

                <View style={{ height: 2, backgroundColor: step3 ? C.primary : '#E2E8F0', flex: 1, marginTop: 24, marginHorizontal: -40, zIndex: 1 }} />

                {/* Step 3 */}
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: step3 ? '#ECFDF5' : '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 2, borderColor: step3 ? C.primary : '#E2E8F0', zIndex: 2 }}>
                    <CheckCircle2 size={20} color={step3 ? C.primary : '#94A3B8'} />
                  </View>
                  <Text style={{ fontWeight: '800', color: step3 ? C.textDark : C.textMuted, fontSize: 15 }}>Entregables Listos</Text>
                  <Text style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>{step3 ? 'Finalizado' : 'En espera'}</Text>
                </View>
              </View>

              {/* Action Buttons based on Status */}
              <View style={{ marginTop: 40, backgroundColor: '#F8FAFC', padding: 20, borderRadius: 16 }}>
                
                {showScheduleForm ? (
                  <View style={{ gap: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: C.textDark }}>Agendar Cita con Fotógrafo</Text>
                      <TouchableOpacity onPress={() => setShowScheduleForm(false)} style={{ padding: 4 }}>
                        <X size={20} color={C.textMuted} />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: C.textDark, fontWeight: '700', marginBottom: 8 }}>Fecha</Text>
                        <TextInput 
                          value={scheduledDate}
                          onChangeText={setScheduledDate}
                          placeholder="Ej. 15 de Mayo, 2026"
                          style={{ backgroundColor: 'white', borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, fontSize: 14, outlineStyle: 'none' }}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: C.textDark, fontWeight: '700', marginBottom: 8 }}>Hora</Text>
                        <TextInput 
                          value={scheduledTime}
                          onChangeText={setScheduledTime}
                          placeholder="Ej. 14:00 hrs"
                          style={{ backgroundColor: 'white', borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 14, fontSize: 14, outlineStyle: 'none' }}
                        />
                      </View>
                    </View>

                    <TouchableOpacity 
                      onPress={() => handleUpdateStatus('Planificado')}
                      disabled={!scheduledDate || !scheduledTime}
                      style={{ backgroundColor: (!scheduledDate || !scheduledTime) ? '#94A3B8' : C.info, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 }}
                    >
                      <Text style={{ color: 'white', fontWeight: '800', fontSize: 14 }}>Confirmar e Informar Cliente</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: C.textDark }}>
                        {isCompleted ? 'Servicio Finalizado y Entregado' : isScheduled ? 'El equipo está preparado para la sesión.' : 'Requiere tu acción para continuar.'}
                      </Text>
                      <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>
                        {isCompleted ? 'Todos los archivos han sido generados.' : isScheduled ? 'Asegúrate de contactar al anfitrión.' : 'Planifica este servicio y asigna un fotógrafo.'}
                      </Text>
                    </View>
                    
                    {isUpdating ? (
                      <ActivityIndicator color={C.primary} />
                    ) : (
                      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        
                        {isPending && (
                          <TouchableOpacity onPress={() => setShowScheduleForm(true)} style={{ backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ color: 'white', fontWeight: '800', fontSize: 14 }}>Agendar y Planificar</Text>
                            <Calendar size={16} color="white" />
                          </TouchableOpacity>
                        )}

                        {isScheduled && (
                          <>
                            <TouchableOpacity onPress={() => handleUpdateStatus('Pendiente')} style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 13 }}>Revertir a Pendiente</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUpdateStatus('Completado')} style={{ backgroundColor: C.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                              <Text style={{ color: 'white', fontWeight: '800', fontSize: 14 }}>Marcar Completado</Text>
                              <CheckCircle2 size={16} color="white" />
                            </TouchableOpacity>
                          </>
                        )}

                        {isCompleted && (
                          <TouchableOpacity onPress={() => handleUpdateStatus('Planificado')} style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
                            <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 13 }}>Revertir a Planificado</Text>
                          </TouchableOpacity>
                        )}
                        
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Scope of Work */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark }}>Alcance del Paquete</Text>
                <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                  <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' }}>{service.packageName}</Text>
                </View>
              </View>
              
              <View style={{ gap: 16 }}>
                {deliverables.map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: item.active ? '#FFFFFF' : '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: item.active ? '#E2E8F0' : '#F1F5F9', opacity: item.active ? 1 : 0.5 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: item.active ? '#F1F5F9' : '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                      <item.icon size={20} color={C.textDark} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 15, fontWeight: item.active ? '700' : '500', color: C.textDark, textDecorationLine: item.active ? 'none' : 'line-through' }}>{item.label}</Text>
                    {item.active ? <CheckCircle size={20} color={C.primary} /> : <Circle size={20} color={C.textMuted} />}
                  </View>
                ))}
              </View>
            </View>

          </View>

          {/* ─── RIGHT COLUMN (Logistics & Financials) ─── */}
          <View style={{ flex: 1, gap: 32 }}>
            
            {/* Location Card */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
              <View style={{ height: 120, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' }}>
                {/* Simulated Map Background */}
                <MapPin size={40} color="#94A3B8" opacity={0.5} />
              </View>
              <View style={{ padding: 24 }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: C.textMuted, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Punto de Encuentro</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.textDark, marginBottom: 4 }}>Coordenadas GPS</Text>
                <Text style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>
                  {service.location ? `${service.location.lat.toFixed(6)}, ${service.location.lng.toFixed(6)}` : 'Ubicación no proporcionada'}
                </Text>
                
                <TouchableOpacity style={{ backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: C.border }}>
                  <Navigation size={16} color={C.textDark} />
                  <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 13 }}>Abrir en Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Financial Summary */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Receipt size={20} color={C.textDark} />
                <Text style={{ fontSize: 16, fontWeight: '900', color: C.textDark }}>Resumen Financiero</Text>
              </View>
              
              <View style={{ gap: 12, marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: C.textMuted, fontSize: 14 }}>Subtotal Paquete</Text>
                  <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '600' }}>{service.price}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: C.textMuted, fontSize: 14 }}>Impuestos (0%)</Text>
                  <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '600' }}>$0.00</Text>
                </View>
              </View>
              
              <View style={{ borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '900' }}>Total Pagado</Text>
                <Text style={{ color: C.primary, fontSize: 24, fontWeight: '900' }}>{service.price}</Text>
              </View>
            </View>

            {/* Client Contact Card */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: C.textMuted, letterSpacing: 1, marginBottom: 20, textTransform: 'uppercase' }}>Información del Cliente</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <User size={24} color="#94A3B8" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '900', color: C.textDark }}>
                    {ownerData?.displayName || ownerData?.name || ownerData?.firstName || 'Usuario Propietario'}
                  </Text>
                  <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{ownerData?.email || 'Sin correo'}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#EFF6FF', paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}>
                  <Phone size={16} color="#3B82F6" />
                  <Text style={{ color: '#3B82F6', fontWeight: '800', fontSize: 13 }}>Llamar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: C.border }}>
                  <MessageCircle size={16} color={C.textDark} />
                  <Text style={{ color: C.textDark, fontWeight: '800', fontSize: 13 }}>Mensaje</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        </View>
      </ScrollView>

      {/* ─── OVERLAY MODAL NOTA INTERNA ─── */}
      {showNoteModal && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 999, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#FFFFFF', width: '90%', maxWidth: 480, borderRadius: 24, padding: 32, shadowColor: '#000', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.1, shadowRadius: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>Notas Internas (Privado)</Text>
              <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                <X size={24} color={C.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 14, color: C.textMuted, marginBottom: 16 }}>
              Esta información solo es visible para ti y el equipo de administración. El cliente nunca verá esto.
            </Text>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              multiline
              placeholder="Escribe detalles operativos, horarios preferidos, problemas, material extra requerido..."
              placeholderTextColor="#94A3B8"
              style={{ 
                backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', 
                borderRadius: 16, padding: 16, fontSize: 15, height: 160, textAlignVertical: 'top',
                outlineStyle: 'none', color: C.textDark
              }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 24, gap: 12 }}>
              <TouchableOpacity onPress={() => setShowNoteModal(false)} style={{ paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 }}>
                <Text style={{ color: C.textMuted, fontWeight: '700' }}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveNote} style={{ backgroundColor: C.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {isSavingNote ? <ActivityIndicator size="small" color="white" /> : <Text style={{ color: 'white', fontWeight: '800' }}>Guardar Nota</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </View>
  );
}
