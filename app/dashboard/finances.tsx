import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search, Plus, MoreHorizontal, DollarSign, TrendingUp,
  ArrowUpRight, ArrowDownLeft, Filter, ChevronLeft, ChevronRight,
  Download, Wallet, CreditCard, PieChart, Clock, Calendar, CheckSquare, XCircle, CheckCircle2
} from 'lucide-react-native';

const C = {
  bg: '#FFFFFF',            
  card: '#FFFFFF',          
  primary: '#10B981',       
  mint: '#2DD4BF',          
  textDark: '#0F172A',
  textMuted: '#64748B',
  borderLight: '#F1F5F9',   
};

const FIN_KPIS = [
  { id: 0, title: 'Balance Neto', value: '$ 12,144', trend: 'Disponible', isPos: true, icon: DollarSign, color: C.primary },
  { id: 1, title: 'Ingresos Totales', value: '$ 128,430', trend: '+12.5%', isPos: true, icon: TrendingUp, color: '#3B82F6' },
  { id: 2, title: 'Comisiones Cobradas', value: '$ 19,264', trend: '+8.4%', isPos: true, icon: PieChart, color: C.mint },
  { id: 3, title: 'Pagos realizados a owners', value: '$ 102,166', trend: '+14.2%', isPos: true, icon: Wallet, color: '#8B5CF6' },
  { id: 4, title: 'Retiros Pendientes', value: '$ 7,120', trend: '5 solicitudes', isPos: false, icon: CreditCard, color: '#F59E0B' },
];

const MOVIMIENTOS_SUMMARY = [
  { id: 'TX-9021', concept: 'Reserva Villa de Cristal', type: 'Ingreso', amount: '+$ 4,250', commission: '$ 425', time: '10:45 AM', status: 'Completado' },
  { id: 'TX-8832', concept: 'Retiro Carlos Ruiz', type: 'Retiro', amount: '-$ 2,400', commission: '-', time: '04:20 PM', status: 'Pendiente' },
  { id: 'TX-7741', concept: 'Reserva Loft 503', type: 'Ingreso', amount: '+$ 960', commission: '$ 96', time: '11:15 AM', status: 'Completado' },
];

const RETIROS_OPERATIVOS = [
  { id: 'W-001', owner: 'Carlos Ruiz', amount: '$ 2,400', date: '20 Abr, 09:00 AM', status: 'Pendiente', bank: 'BAC Credomatic' },
  { id: 'W-002', owner: 'Ana García', amount: '$ 1,200', date: '19 Abr, 03:30 PM', status: 'En proceso', bank: 'BNCR' },
  { id: 'W-003', owner: 'Luis Torres', amount: '$ 4,500', date: '18 Abr, 11:20 AM', status: 'Completado', bank: 'Paypal' },
  { id: 'W-004', owner: 'María Solís', amount: '$ 800', date: '15 Abr, 02:45 PM', status: 'Rechazado', bank: 'BCR' },
];

export default function FinancesScreen() {
  const [activeTab, setActiveTab] = useState('Retiros');
  const [filterType, setFilterType] = useState('Todos');

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
      
      {/* ─── Header Section ─── */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, gap: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 28, fontWeight: '900', color: C.textDark, letterSpacing: -0.5 }}>Finanzas</Text>
          <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>
            {activeTab === 'Resumen' ? 'Visión general del estado financiero del negocio.' : 'Módulo operativo de conciliación y pagos a anfitriones.'}
          </Text>
        </View>

        {/* Tab Bar Eliminado */}
        <View style={{ flex: 1 }} />

        <TouchableOpacity style={{
          flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
          paddingHorizontal: 20, paddingVertical: 12, borderRadius: 999,
          borderWidth: 1, borderColor: '#E2E8F0'
        }}>
          <Download size={16} color={C.textDark} strokeWidth={2.5} />
          <Text style={{ color: C.textDark, fontWeight: '700', marginLeft: 10, fontSize: 14 }}>Exportar reporte</Text>
        </TouchableOpacity>
      </View>

      {/* ─── KPI Cards (Mantener diseño consistente) ─── */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8, marginBottom: 40 }}>
        {FIN_KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <View key={kpi.id} style={{ width: '20%', paddingHorizontal: 8 }}>
              <View style={{
                backgroundColor: C.card, padding: 24, borderRadius: 24,
                shadowColor: '#334155', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.04, shadowRadius: 25, elevation: 5,
                borderWidth: 1, borderColor: C.borderLight, height: '100%'
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} color={kpi.color} strokeWidth={2.5} />
                  </View>
                  <View style={{ backgroundColor: kpi.isPos ? '#ECFDF5' : '#FFFBEB', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 }}>
                    <Text style={{ color: kpi.isPos ? C.primary : '#F59E0B', fontSize: 11, fontWeight: '800' }}>{kpi.trend}</Text>
                  </View>
                </View>
                <Text style={{ color: C.textMuted, fontSize: 10, fontWeight: '800', marginBottom: 4, letterSpacing: 0.5 }}>{kpi.title.toUpperCase()}</Text>
                <Text style={{ color: C.textDark, fontSize: 26, fontWeight: '900', letterSpacing: -1 }}>{kpi.value}</Text>
              </View>
            </View>
          );
        })}
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
                <Text style={{ fontSize: 18, fontWeight: '800', color: C.textDark }}>Control Operativo de Retiros</Text>
                <Text style={{ fontSize: 13, color: C.textMuted, marginTop: 2, fontWeight: '500' }}>Procesa aprobaciones y pagos a anfitriones.</Text>
              </View>
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

            {RETIROS_OPERATIVOS.map((item, idx) => {
              const statusColors = getStatusStyle(item.status);
              return (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: idx === RETIROS_OPERATIVOS.length - 1 ? 0 : 1, borderBottomColor: '#F8FAFC' }}>
                  
                  {/* Owner */}
                  <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <Text style={{ fontWeight: '800', fontSize: 13 }}>{item.owner.charAt(0)}</Text>
                    </View>
                    <Text style={{ color: C.textDark, fontSize: 14, fontWeight: '800' }}>{item.owner}</Text>
                  </View>

                  {/* Monto */}
                  <Text style={{ flex: 1.2, color: '#EF4444', fontSize: 15, fontWeight: '900' }}>{item.amount}</Text>

                  {/* Banco */}
                  <Text style={{ flex: 1.5, color: C.textMuted, fontSize: 14, fontWeight: '600' }}>{item.bank}</Text>

                  {/* Fecha */}
                  <Text style={{ flex: 1.2, color: C.textDark, fontSize: 13, fontWeight: '600' }}>{item.date}</Text>

                  {/* Estado */}
                  <View style={{ flex: 1 }}>
                     <View style={{ alignSelf: 'flex-start', backgroundColor: statusColors.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                        <Text style={{ color: statusColors.text, fontSize: 11, fontWeight: '800' }}>{item.status.toUpperCase()}</Text>
                     </View>
                  </View>

                  {/* Acciones Operativas */}
                  <View style={{ width: 140, flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
                    {item.status === 'Pendiente' ? (
                      <TouchableOpacity style={{ backgroundColor: '#F0FDF4', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#DCFCE7' }}>
                        <CheckSquare size={16} color={C.primary} />
                      </TouchableOpacity>
                    ) : item.status === 'En proceso' ? (
                      <TouchableOpacity style={{ backgroundColor: '#F0F9FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#E0F2FE' }}>
                        <Text style={{ color: '#0369A1', fontSize: 11, fontWeight: '800' }}>PAGAR</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ opacity: 0.3 }}><MoreHorizontal size={18} color={C.textMuted} /></View>
                    )}
                    {item.status === 'Pendiente' && (
                      <TouchableOpacity style={{ backgroundColor: '#FEF2F2', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#FEE2E2' }}>
                        <XCircle size={16} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}

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
