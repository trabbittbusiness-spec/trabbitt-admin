import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal, Pressable, StyleSheet, Clipboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search, Plus, MoreHorizontal, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownLeft, Filter, ChevronLeft, ChevronRight,
  Download, Wallet, CreditCard, PieChart, Clock, Calendar, CheckSquare, XCircle, CheckCircle2,
  Eye, User, Info, Building2, Star, Copy, EyeOff
} from 'lucide-react-native';
import { db } from '../../src/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit, updateDoc, doc, where } from 'firebase/firestore';

const C = {
  bg: '#FFFFFF',            
  card: '#FFFFFF',          
  primary: '#10B981',       
  mint: '#2DD4BF',          
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',   
};

export default function FinancesScreen() {
  const [activeTab, setActiveTab] = useState<'Pendientes' | 'Historial'>('Pendientes');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'withdrawal_requests'),
      activeTab === 'Pendientes' 
        ? where('status', '==', 'Pendiente')
        : where('status', 'in', ['Completado', 'Rechazado']),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        dateFormatted: d.data().createdAt ? new Date(d.data().createdAt.seconds * 1000).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recién ahora'
      }));
      setWithdrawals(data);
      setLoading(false);
    });
    return () => unsub();
  }, [activeTab]);

  // Cálculos operativos para la barra de resumen
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalWithdrawnThisMonth = withdrawals
    .filter(w => {
      if (w.status !== 'Completado' || !w.createdAt) return false;
      const d = new Date(w.createdAt.seconds * 1000);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, w) => acc + (w.totalToReceive || 0), 0);

  const pendingRequestsCount = withdrawals.filter(w => w.status === 'Pendiente').length;
  const pendingAmount = withdrawals.filter(w => w.status === 'Pendiente').reduce((acc, w) => acc + (w.amount || 0), 0);
  const totalCommissions = withdrawals.reduce((acc, w) => acc + (w.trabbittFee || 0), 0);

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [isPrivate, setIsPrivate] = useState(false);

  const formatAmount = (amount: number) => {
    if (isPrivate) return '••••••';
    return `$ ${amount.toLocaleString()}`;
  };

  const handleCopy = (text: string, label: string) => {
    Clipboard.setString(text);
    alert(`${label} copiado al portapapeles`);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const docRef = doc(db, 'withdrawal_requests', id);
      await updateDoc(docRef, { status: newStatus });
      
      // Si se aprueba, podríamos querer actualizar la actividad de la billetera también
      // Pero por ahora, con actualizar el request es suficiente para el flujo Admin
      
      setSelectedWithdrawal(null);
      alert(`Solicitud ${newStatus === 'Completado' ? 'aprobada' : 'rechazada'} con éxito.`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Completado': return { text: '#10B981', bg: '#ECFDF5' };
      case 'Pendiente': return { text: '#F59E0B', bg: '#FFFBEB' };
      case 'En proceso': return { text: '#3B82F6', bg: '#EFF6FF' };
      case 'Rechazado': return { text: '#EF4444', bg: '#FEF2F2' };
      default: return { text: '#64748B', bg: '#F8FAFC' };
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 40, paddingBottom: 100 }}>
       {/* Detalle de Retiro SIDE DRAWER */}
      <Modal visible={!!selectedWithdrawal} transparent animationType="fade" onRequestClose={() => setSelectedWithdrawal(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setSelectedWithdrawal(null)} />
          
          <View style={{ backgroundColor: '#FFFFFF', width: '100%', maxWidth: 480, height: '100%', shadowColor: '#000', shadowOffset: { width: -10, height: 0 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }}>
            
            {/* Header del Drawer */}
            <View style={{ backgroundColor: '#F8FAFC', padding: 32, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60 }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: C.textDark }}>Detalles del Retiro</Text>
                  <View style={{ backgroundColor: getStatusStyle(selectedWithdrawal?.status).bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                    <Text style={{ color: getStatusStyle(selectedWithdrawal?.status).text, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>{selectedWithdrawal?.status}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: C.textMuted, fontWeight: '600' }}>ID: {selectedWithdrawal?.id?.substring(0, 12).toUpperCase()}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedWithdrawal(null)} style={{ width: 40, height: 40, backgroundColor: '#FFFFFF', borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}>
                <XCircle size={20} color={C.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 32 }}>
              {selectedWithdrawal && (
                <View style={{ gap: 32 }}>
                  
                  {/* Perfil del Anfitrión */}
                  <View style={{ flexDirection: 'column', gap: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                      <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#10B98110', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#10B98120' }}>
                        <Text style={{ fontWeight: '900', fontSize: 24, color: C.primary }}>{selectedWithdrawal.ownerName.charAt(0)}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>{selectedWithdrawal.ownerName}</Text>
                          <CheckCircle2 size={16} color={C.primary} />
                        </View>
                        <Text style={{ fontSize: 14, color: C.textMuted, fontWeight: '500' }}>{selectedWithdrawal.ownerEmail || 'Email no disponible'}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F1F5F9', padding: 12, borderRadius: 12, alignSelf: 'flex-start' }}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <Text style={{ fontSize: 12, fontWeight: '800', color: C.textDark }}>4.9 • Host SuperVerificado</Text>
                    </View>
                  </View>

                  {/* Desglose Financiero */}
                  <View style={{ backgroundColor: '#F8FAFC', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#F1F5F9' }}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: C.textMuted, letterSpacing: 1, marginBottom: 20 }}>RESUMEN DE LIQUIDACIÓN</Text>
                    
                    <View style={{ gap: 14 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: C.textMuted, fontSize: 14, fontWeight: '600' }}>Monto Bruto</Text>
                        <Text style={{ color: C.textDark, fontSize: 15, fontWeight: '800' }}>{formatAmount(selectedWithdrawal.amount)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: C.textMuted, fontSize: 14, fontWeight: '600' }}>Comisión Trabbitt ({selectedWithdrawal.hostCommissionPercent}%)</Text>
                        <Text style={{ color: '#EF4444', fontSize: 15, fontWeight: '800' }}>- {formatAmount(selectedWithdrawal.trabbittFee)}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: C.textMuted, fontSize: 14, fontWeight: '600' }}>Fee de Procesador</Text>
                        <Text style={{ color: '#EF4444', fontSize: 15, fontWeight: '800' }}>- {formatAmount(selectedWithdrawal.processorFee)}</Text>
                      </View>
                      
                      <View style={{ height: 1, backgroundColor: '#E2E8F0', marginVertical: 10, borderStyle: 'dashed' }} />
                      
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: C.textDark, fontSize: 16, fontWeight: '900' }}>Neto Final</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <Text style={{ color: C.primary, fontSize: 28, fontWeight: '900' }}>{formatAmount(selectedWithdrawal.totalToReceive)}</Text>
                          <TouchableOpacity onPress={() => handleCopy(selectedWithdrawal.totalToReceive?.toFixed(2), 'Monto')} style={{ backgroundColor: '#10B98110', padding: 8, borderRadius: 8 }}>
                            <Copy size={14} color={C.primary} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Datos Bancarios */}
                  <View style={{ gap: 20 }}>
                    <View style={{ gap: 8 }}>
                       <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Building2 size={16} color={C.primary} />
                          <Text style={{ fontSize: 12, fontWeight: '900', color: C.textMuted }}>BANCO / MÉTODO</Text>
                       </View>
                       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 16, fontWeight: '800', color: C.textDark }}>{selectedWithdrawal.bank} <Text style={{ color: C.textMuted, fontWeight: '600' }}>({selectedWithdrawal.processorName})</Text></Text>
                          <TouchableOpacity onPress={() => handleCopy(selectedWithdrawal.bank, 'Banco')} style={{ padding: 8 }}>
                            <Copy size={14} color={C.textMuted} />
                          </TouchableOpacity>
                       </View>
                    </View>
                    <View style={{ gap: 8 }}>
                       <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <CreditCard size={16} color={C.primary} />
                          <Text style={{ fontSize: 12, fontWeight: '900', color: C.textMuted }}>DETALLES DE CUENTA</Text>
                       </View>
                       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={{ fontSize: 16, fontWeight: '800', color: C.textDark }}>{selectedWithdrawal.accountDetails}</Text>
                          <TouchableOpacity onPress={() => handleCopy(selectedWithdrawal.accountDetails, 'Cuenta')} style={{ padding: 8 }}>
                            <Copy size={14} color={C.textMuted} />
                          </TouchableOpacity>
                       </View>
                    </View>
                  </View>

                  {/* Notas Operativas */}
                  <View style={{ gap: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: C.textMuted }}>NOTAS DEL ADMINISTRADOR</Text>
                    <TextInput 
                      placeholder="Escribe una nota interna sobre este retiro..."
                      placeholderTextColor="#94A3B8"
                      multiline
                      style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 16, height: 100, fontSize: 14, color: C.textDark, borderWidth: 1, borderColor: '#F1F5F9', textAlignVertical: 'top' }}
                    />
                  </View>

                </View>
              )}
            </ScrollView>

            {/* Footer Fijo del Drawer */}
            <View style={{ padding: 32, paddingBottom: 50, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 }}>
              {isUpdating ? (
                <ActivityIndicator color={C.primary} size="large" style={{ marginVertical: 20 }} />
              ) : selectedWithdrawal?.status === 'Pendiente' ? (
                <>
                  <TouchableOpacity 
                    style={{ width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', backgroundColor: C.primary, shadowColor: C.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 }}
                    onPress={() => handleUpdateStatus(selectedWithdrawal.id, 'Completado')}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 15 }}>APROBAR TRANSFERENCIA</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{ width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', backgroundColor: '#FEF2F2' }}
                    onPress={() => handleUpdateStatus(selectedWithdrawal.id, 'Rechazado')}
                  >
                    <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 15 }}>RECHAZAR SOLICITUD</Text>
                  </TouchableOpacity>
                </>
              ) : null}
              
              {!isUpdating && (
                <TouchableOpacity 
                  onPress={() => setSelectedWithdrawal(null)}
                  style={{ width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F1F5F9' }}
                >
                  <Text style={{ color: C.textMuted, fontWeight: '900', fontSize: 15 }}>CERRAR PANEL</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
      
      {/* ─── Header Section ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Finanzas</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Módulo operativo de pagos y conciliación.</Text>
        </View>

        {/* Mini Resumen Operativo con Modo Privacidad */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
           
           <TouchableOpacity 
             onPress={() => setIsPrivate(!isPrivate)}
             style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' }}
           >
             {isPrivate ? <EyeOff size={18} color={C.textMuted} /> : <Eye size={18} color={C.primary} />}
           </TouchableOpacity>

           <View style={{ width: 1, backgroundColor: '#E2E8F0', height: 24 }} />

           <View>
             <Text style={{ fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 0.5, marginBottom: 2 }}>PENDIENTE POR PAGAR</Text>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
               <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#F59E0B' }} />
               <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark }}>{formatAmount(pendingAmount)}</Text>
             </View>
           </View>

           <View style={{ width: 1, backgroundColor: '#E2E8F0', height: 24 }} />

           <TouchableOpacity 
             onPress={() => setActiveTab('Historial')}
             style={{ cursor: 'pointer' }}
           >
             <Text style={{ fontSize: 10, fontWeight: '800', color: C.textMuted, letterSpacing: 0.5, marginBottom: 2 }}>PAGADO ESTE MES</Text>
             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
               <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary }} />
               <Text style={{ fontSize: 18, fontWeight: '900', color: C.textDark }}>{formatAmount(totalWithdrawnThisMonth)}</Text>
             </View>
           </TouchableOpacity>
        </View>
      </View>

      {/* ─── Contenido: Control Operativo de Retiros ─── */}
      <View style={{
        backgroundColor: C.card, borderRadius: 24, padding: 32,
        shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
        borderWidth: 1, borderColor: C.borderLight
      }}>
        
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: '900', color: C.textDark }}>Control Operativo de Retiros</Text>
                <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Procesa aprobaciones y pagos a anfitriones.</Text>
              </View>
              
              {/* Tab Switcher */}
              <View style={{ flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 4, borderRadius: 12 }}>
                {['Pendientes', 'Historial'].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab as any)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
                      shadowColor: activeTab === tab ? '#000' : 'transparent',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.05,
                      shadowRadius: 4,
                      elevation: activeTab === tab ? 2 : 0
                    }}
                  >
                    <Text style={{ 
                      fontSize: 13, 
                      fontWeight: '800', 
                      color: activeTab === tab ? C.primary : C.textMuted 
                    }}>
                      {tab === 'Pendientes' ? `Pendientes (${withdrawals.filter(w => w.status === 'Pendiente').length})` : 'Historial'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <View style={{
                  flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
                  borderWidth: 1, borderColor: '#E2E8F0', width: 300
                }}>
                  <Search size={14} color={C.textMuted} />
                  <TextInput placeholder="Buscar solicitud..." style={{ marginLeft: 10, fontSize: 13, flex: 1, outlineStyle: 'none' }} />
              </View>
            </View>

            {/* Tabla de Retiros */}
            <View style={{ flexDirection: 'row', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', marginBottom: 8 }}>
              <Text style={{ flex: 1.5, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ANFITRIÓN</Text>
              <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>MONTO SOLICITADO</Text>
              <Text style={{ flex: 1.5, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>BANCO / DESTINO</Text>
              <Text style={{ flex: 1.2, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>FECHA PETICIÓN</Text>
              <Text style={{ flex: 1, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>ESTADO</Text>
              <Text style={{ width: 140, color: '#94A3B8', fontSize: 11, fontWeight: '800', letterSpacing: 1, textAlign: 'center' }}>ACCIONES</Text>
            </View>

            {loading ? (
              <ActivityIndicator color={C.primary} style={{ marginVertical: 40 }} />
            ) : (
              withdrawals.map((item, idx) => {
                const statusColors = getStatusStyle(item.status);
                return (
                  <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: idx === withdrawals.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' }}>
                    
                    {/* Owner */}
                    <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                        <Text style={{ fontWeight: '800', fontSize: 13 }}>{(item.ownerName || 'U').charAt(0)}</Text>
                      </View>
                      <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.ownerName || 'Usuario'}</Text>
                    </View>
  
                    {/* Monto */}
                    <Text style={{ flex: 1.2, color: '#EF4444', fontSize: 15, fontWeight: '900' }}>{formatAmount(item.amount)}</Text>
  
                    {/* Banco */}
                    <Text style={{ flex: 1.5, color: C.textMuted, fontSize: 14, fontWeight: '600' }}>{item.bank}</Text>
  
                    {/* Fecha */}
                    <Text style={{ flex: 1.2, color: C.textDark, fontSize: 13, fontWeight: '600' }}>{item.dateFormatted}</Text>
  
                    {/* Estado */}
                    <View style={{ flex: 1 }}>
                       <View style={{ alignSelf: 'flex-start', backgroundColor: statusColors.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                          <Text style={{ color: statusColors.text, fontSize: 11, fontWeight: '800' }}>{item.status.toUpperCase()}</Text>
                       </View>
                    </View>
  
                    {/* Acciones Operativas: Solo Ojo para ver detalles */}
                    <View style={{ width: 140, flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
                      <TouchableOpacity 
                        onPress={() => setSelectedWithdrawal(item)}
                        style={{ backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', gap: 8 }}
                      >
                        <Eye size={16} color={C.textDark} />
                        <Text style={{ fontSize: 12, fontWeight: '800', color: C.textDark }}>DETALLES</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}

            {/* ─── Paginación Retiros ─── */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
                <Text style={{ color: C.textMuted, fontSize: 14, fontWeight: '600' }}>Mostrando <Text style={{ color: C.textDark, fontWeight: '800' }}>1 a 4</Text> de 18 solicitudes</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={{ padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
                    <ChevronLeft size={18} color={C.textMuted} strokeWidth={2.5} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 }}>
                    {[1, 2, 3, '...', 4].map((page, idx) => (
                    <TouchableOpacity key={idx} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: page === 1 ? C.textDark : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: page === 1 ? '#FFFFFF' : C.textMuted, fontWeight: page === 1 ? '800' : '600', fontSize: 14 }}>{page}</Text>
                    </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity style={{ padding: 10, backgroundColor: '#F8FAFC', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' }}>
                    <ChevronRight size={18} color={C.textDark} strokeWidth={2.5} />
                </TouchableOpacity>
                </View>
            </View>
          </View>
      </View>

    </ScrollView>
  );
}
